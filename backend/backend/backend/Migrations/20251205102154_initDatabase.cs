using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class initDatabase : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DailyTips",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Category = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DailyTips", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DailyWords",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Word = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Phonetic = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Type = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Definition = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Example = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DailyWords", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ListeningTests",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SubTitle = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TestType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Skill = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AudioUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    QuestionRange = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AudioDuration = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ListeningTests", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ReadingTests",
                columns: table => new
                {
                    TestId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    TestType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Skill = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TotalDuration = table.Column<int>(type: "int", nullable: false),
                    QuestionRange = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Subtitle = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Button = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReadingTests", x => x.TestId);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Role = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RefreshToken = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RefreshExpireTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "WritingTests",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Topic = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Skill = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Subtitle = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Duration = table.Column<int>(type: "int", nullable: false),
                    TestType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WritingTests", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ListeningParts",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ListeningTestId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    PartNumber = table.Column<int>(type: "int", nullable: false),
                    PartTitle = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Context = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    QuestionRange = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PartAudioUrl = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ListeningParts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ListeningParts_ListeningTests_ListeningTestId",
                        column: x => x.ListeningTestId,
                        principalTable: "ListeningTests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ReadingParts",
                columns: table => new
                {
                    PartId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TestId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    PartNumber = table.Column<int>(type: "int", nullable: false),
                    PartTitle = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PassageTitle = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Skill = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ThumbnailUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TestDuration = table.Column<int>(type: "int", nullable: false),
                    QuestionRange = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Text = table.Column<string>(type: "ntext", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReadingParts", x => x.PartId);
                    table.ForeignKey(
                        name: "FK_ReadingParts_ReadingTests_TestId",
                        column: x => x.TestId,
                        principalTable: "ReadingTests",
                        principalColumn: "TestId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MileStones",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Date = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EventTitle = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EventDetail = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MileStones", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MileStones_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Profiles",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Bio = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FullName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TargetScore = table.Column<float>(type: "real", nullable: true),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DateOfBirth = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AvatarUrl = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Profiles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Profiles_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ReadingTestResults",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TakenDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FinishDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Score = table.Column<double>(type: "float", nullable: false),
                    IsCompleted = table.Column<bool>(type: "bit", nullable: false),
                    Skill = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TestId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReadingTestResults", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ReadingTestResults_ReadingTests_TestId",
                        column: x => x.TestId,
                        principalTable: "ReadingTests",
                        principalColumn: "TestId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ReadingTestResults_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "WritingSubmissions",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TestId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    WordCount = table.Column<int>(type: "int", nullable: false),
                    SubmittedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsRead = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WritingSubmissions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WritingSubmissions_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_WritingSubmissions_WritingTests_TestId",
                        column: x => x.TestId,
                        principalTable: "WritingTests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ListeningSections",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ListeningPartId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    SectionNumber = table.Column<int>(type: "int", nullable: false),
                    SectionRange = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SectionTitle = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    QuestionType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Instructions = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    WordLimit = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MapImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MaxAnswers = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ListeningSections", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ListeningSections_ListeningParts_ListeningPartId",
                        column: x => x.ListeningPartId,
                        principalTable: "ListeningParts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ReadingSections",
                columns: table => new
                {
                    SectionId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SectionNumber = table.Column<int>(type: "int", nullable: false),
                    PartId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SectionRange = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SectionTitle = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    QuestionType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Instructions = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    WordLimit = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    GapFillText = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TableJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    OptionRange = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReadingSections", x => x.SectionId);
                    table.ForeignKey(
                        name: "FK_ReadingSections_ReadingParts_PartId",
                        column: x => x.PartId,
                        principalTable: "ReadingParts",
                        principalColumn: "PartId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "WritingResults",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    SubmissionId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    OverallScore = table.Column<double>(type: "float", nullable: false),
                    TaskResponseScore = table.Column<double>(type: "float", nullable: false),
                    CoherenceCohesionScore = table.Column<double>(type: "float", nullable: false),
                    LexicalResourceScore = table.Column<double>(type: "float", nullable: false),
                    GrammaticalRangeAccuracyScore = table.Column<double>(type: "float", nullable: false),
                    GeneralFeedback = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    GrammarFeedback = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    VocabularyFeedback = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    GradedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WritingResults", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WritingResults_WritingSubmissions_SubmissionId",
                        column: x => x.SubmissionId,
                        principalTable: "WritingSubmissions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ListeningQuestions",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ListeningSectionId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    QuestionNumber = table.Column<int>(type: "int", nullable: false),
                    QuestionText = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Label = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Value = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsInput = table.Column<bool>(type: "bit", nullable: true),
                    WordLimit = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ListeningQuestions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ListeningQuestions_ListeningSections_ListeningSectionId",
                        column: x => x.ListeningSectionId,
                        principalTable: "ListeningSections",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ReadingQuestions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    QuestionNumber = table.Column<int>(type: "int", nullable: false),
                    SectionId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    QuestionText = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DiagramLabelsJson = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReadingQuestions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ReadingQuestions_ReadingSections_SectionId",
                        column: x => x.SectionId,
                        principalTable: "ReadingSections",
                        principalColumn: "SectionId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SectionOptions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SectionId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Text = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Key = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SectionOptions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SectionOptions_ReadingSections_SectionId",
                        column: x => x.SectionId,
                        principalTable: "ReadingSections",
                        principalColumn: "SectionId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ListeningAnswers",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ListeningQuestionId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    AnswerText = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ListeningAnswers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ListeningAnswers_ListeningQuestions_ListeningQuestionId",
                        column: x => x.ListeningQuestionId,
                        principalTable: "ListeningQuestions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ListeningOptions",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ListeningQuestionId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Key = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Text = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ListeningOptions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ListeningOptions_ListeningQuestions_ListeningQuestionId",
                        column: x => x.ListeningQuestionId,
                        principalTable: "ListeningQuestions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "QuestionAnswer",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Index = table.Column<int>(type: "int", nullable: false),
                    QuestionId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuestionAnswer", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuestionAnswer_ReadingQuestions_QuestionId",
                        column: x => x.QuestionId,
                        principalTable: "ReadingQuestions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "QuestionOptions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Index = table.Column<int>(type: "int", nullable: false),
                    QuestionId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Text = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuestionOptions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuestionOptions_ReadingQuestions_QuestionId",
                        column: x => x.QuestionId,
                        principalTable: "ReadingQuestions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ListeningAnswers_ListeningQuestionId",
                table: "ListeningAnswers",
                column: "ListeningQuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_ListeningOptions_ListeningQuestionId",
                table: "ListeningOptions",
                column: "ListeningQuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_ListeningParts_ListeningTestId",
                table: "ListeningParts",
                column: "ListeningTestId");

            migrationBuilder.CreateIndex(
                name: "IX_ListeningQuestions_ListeningSectionId",
                table: "ListeningQuestions",
                column: "ListeningSectionId");

            migrationBuilder.CreateIndex(
                name: "IX_ListeningSections_ListeningPartId",
                table: "ListeningSections",
                column: "ListeningPartId");

            migrationBuilder.CreateIndex(
                name: "IX_MileStones_UserId",
                table: "MileStones",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Profiles_UserId",
                table: "Profiles",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_QuestionAnswer_QuestionId",
                table: "QuestionAnswer",
                column: "QuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionOptions_QuestionId",
                table: "QuestionOptions",
                column: "QuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_ReadingParts_TestId",
                table: "ReadingParts",
                column: "TestId");

            migrationBuilder.CreateIndex(
                name: "IX_ReadingQuestions_SectionId",
                table: "ReadingQuestions",
                column: "SectionId");

            migrationBuilder.CreateIndex(
                name: "IX_ReadingSections_PartId",
                table: "ReadingSections",
                column: "PartId");

            migrationBuilder.CreateIndex(
                name: "IX_ReadingTestResults_TestId",
                table: "ReadingTestResults",
                column: "TestId");

            migrationBuilder.CreateIndex(
                name: "IX_ReadingTestResults_UserId",
                table: "ReadingTestResults",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_SectionOptions_SectionId",
                table: "SectionOptions",
                column: "SectionId");

            migrationBuilder.CreateIndex(
                name: "IX_WritingResults_SubmissionId",
                table: "WritingResults",
                column: "SubmissionId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_WritingSubmissions_TestId",
                table: "WritingSubmissions",
                column: "TestId");

            migrationBuilder.CreateIndex(
                name: "IX_WritingSubmissions_UserId",
                table: "WritingSubmissions",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DailyTips");

            migrationBuilder.DropTable(
                name: "DailyWords");

            migrationBuilder.DropTable(
                name: "ListeningAnswers");

            migrationBuilder.DropTable(
                name: "ListeningOptions");

            migrationBuilder.DropTable(
                name: "MileStones");

            migrationBuilder.DropTable(
                name: "Profiles");

            migrationBuilder.DropTable(
                name: "QuestionAnswer");

            migrationBuilder.DropTable(
                name: "QuestionOptions");

            migrationBuilder.DropTable(
                name: "ReadingTestResults");

            migrationBuilder.DropTable(
                name: "SectionOptions");

            migrationBuilder.DropTable(
                name: "WritingResults");

            migrationBuilder.DropTable(
                name: "ListeningQuestions");

            migrationBuilder.DropTable(
                name: "ReadingQuestions");

            migrationBuilder.DropTable(
                name: "WritingSubmissions");

            migrationBuilder.DropTable(
                name: "ListeningSections");

            migrationBuilder.DropTable(
                name: "ReadingSections");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "WritingTests");

            migrationBuilder.DropTable(
                name: "ListeningParts");

            migrationBuilder.DropTable(
                name: "ReadingParts");

            migrationBuilder.DropTable(
                name: "ListeningTests");

            migrationBuilder.DropTable(
                name: "ReadingTests");
        }
    }
}
