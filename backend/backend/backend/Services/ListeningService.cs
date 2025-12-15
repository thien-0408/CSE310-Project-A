using backend.Data;
using backend.Entities.Listening;
using backend.Models.ListeningDto;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace backend.Services
{
    public class ListeningService : IListeningService
    {
        private readonly UserDbContext _context;
        private readonly IFileService _fileService;

        public ListeningService(UserDbContext context, IFileService fileService)
        {
            _context = context;
            _fileService = fileService;
        }

        public async Task<ListeningTest> CreateListeningTestAsync(CreateListeningTestRequest request)
        {
            if (string.IsNullOrEmpty(request.PartsJson))
                throw new ArgumentException("Parts JSON is required");

            List<CreateListeningPartDto> partsData;
            try
            {
                partsData = JsonConvert.DeserializeObject<List<CreateListeningPartDto>>(request.PartsJson)
                            ?? new List<CreateListeningPartDto>();
            }
            catch (JsonException)
            {
                throw new ArgumentException("Invalid JSON format in PartsJson");
            }

            string testImageUrl = string.Empty;
            string testAudioUrl = string.Empty;

            if (request.TestImageFile != null && request.TestImageFile.Length > 0)
                testImageUrl = await _fileService.UploadFile(request.TestImageFile, "listening_images");

            if (request.TestAudioFile != null && request.TestAudioFile.Length > 0)
                testAudioUrl = await _fileService.UploadFile(request.TestAudioFile, "listening_audios");

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var listeningTest = new ListeningTest
                {
                    Id = Guid.NewGuid().ToString(),
                    Title = request.Title,
                    SubTitle = request.SubTitle,
                    QuestionRange = request.QuestionRange,
                    AudioDuration = request.AudioDuration,
                    ImageUrl = testImageUrl,
                    AudioUrl = testAudioUrl,
                    TestType = "full_test",
                    Skill = "listening",
                    CreatedAt = DateTime.UtcNow,
                    Parts = new List<ListeningPart>()
                };

                int sectionMapImageIndex = 0;

                for (int i = 0; i < partsData.Count; i++)
                {
                    var partDto = partsData[i];
                    string partAudioUrl = string.Empty;

                    if (request.PartAudioFiles != null && i < request.PartAudioFiles.Count)
                    {
                        var audioFile = request.PartAudioFiles[i];
                        if (audioFile != null && audioFile.Length > 0)
                        {
                            partAudioUrl = await _fileService.UploadFile(audioFile, "listening_audios");
                        }
                    }

                    var partEntity = new ListeningPart
                    {
                        Id = Guid.NewGuid().ToString(),
                        PartNumber = partDto.PartNumber,
                        PartTitle = partDto.PartTitle,
                        Context = partDto.Context,
                        QuestionRange = partDto.QuestionRange,
                        PartAudioUrl = partAudioUrl,
                        Sections = new List<ListeningSection>()
                    };

                    if (partDto.Sections != null)
                    {
                        foreach (var secDto in partDto.Sections)
                        {
                            string mapUrl = null;
                            if (request.SectionMapImages != null && sectionMapImageIndex < request.SectionMapImages.Count)
                            {
                                var mapFile = request.SectionMapImages[sectionMapImageIndex];
                                if (mapFile != null && mapFile.Length > 0 && secDto.QuestionType == "map_labeling")
                                {
                                    mapUrl = await _fileService.UploadFile(mapFile, "map_images");
                                }
                            }
                            sectionMapImageIndex++;

                            var sectionEntity = new ListeningSection
                            {
                                Id = Guid.NewGuid().ToString(),
                                SectionNumber = secDto.SectionNumber,
                                SectionRange = secDto.SectionRange,
                                SectionTitle = secDto.SectionTitle,
                                QuestionType = secDto.QuestionType,
                                Instructions = secDto.Instructions,
                                WordLimit = secDto.WordLimit,
                                MaxAnswers = secDto.MaxAnswers,
                                MapImageUrl = mapUrl ?? "",
                                Questions = new List<ListeningQuestion>()
                            };

                            if (secDto.Questions != null)
                            {
                                foreach (var qDto in secDto.Questions)
                                {
                                    var questionEntity = new ListeningQuestion
                                    {
                                        Id = Guid.NewGuid().ToString(),
                                        QuestionNumber = qDto.QuestionNumber,
                                        QuestionText = qDto.QuestionText,
                                        Label = qDto.Label,
                                        Value = qDto.Value,
                                        IsInput = qDto.IsInput,
                                        WordLimit = qDto.WordLimit,
                                        Options = new List<ListeningOption>(),
                                        Answers = new List<ListeningAnswer>()
                                    };

                                    if (qDto.Options != null)
                                    {
                                        foreach (var opt in qDto.Options)
                                        {
                                            questionEntity.Options.Add(new ListeningOption
                                            {
                                                Id = Guid.NewGuid().ToString(),
                                                Key = opt.Key,
                                                Text = opt.Text
                                            });
                                        }
                                    }

                                    if (qDto.Answers != null)
                                    {
                                        foreach (var ans in qDto.Answers)
                                        {
                                            questionEntity.Answers.Add(new ListeningAnswer
                                            {
                                                Id = Guid.NewGuid().ToString(),
                                                AnswerText = ans.AnswerText,
                                            });
                                        }
                                    }
                                    sectionEntity.Questions.Add(questionEntity);
                                }
                            }
                            partEntity.Sections.Add(sectionEntity);
                        }
                    }
                    listeningTest.Parts.Add(partEntity);
                }

                _context.ListeningTests.Add(listeningTest);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return listeningTest;
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw; 
            }
        }

        public async Task<ListeningTest?> GetListeningTestByIdAsync(string id)
        {
            var test = await _context.ListeningTests
                .Include(t => t.Parts)
                    .ThenInclude(p => p.Sections)
                        .ThenInclude(s => s.Questions)
                            .ThenInclude(q => q.Options)
                .Include(t => t.Parts)
                    .ThenInclude(p => p.Sections)
                        .ThenInclude(s => s.Questions)
                            .ThenInclude(q => q.Answers)
                .AsSplitQuery()
                .FirstOrDefaultAsync(t => t.Id == id);

            if (test != null && test.Parts != null)
            {
                test.Parts = test.Parts.OrderBy(p => p.PartNumber).ToList();
                foreach (var part in test.Parts)
                {
                    part.Sections = part.Sections.OrderBy(s => s.SectionNumber).ToList();
                    foreach (var section in part.Sections)
                    {
                        section.Questions = section.Questions.OrderBy(q => q.QuestionNumber).ToList();
                        foreach (var question in section.Questions)
                        {
                            if (question.Options != null)
                                question.Options = question.Options.OrderBy(o => o.Key).ToList();
                        }
                    }
                }
            }

            return test;
        }
    }
}