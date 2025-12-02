using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class addWritingRelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "WritingTests",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Topic = table.Column<string>(type: "nvarchar(max)", nullable: false),
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
                name: "WritingSubmissions",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TestId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    WordCount = table.Column<int>(type: "int", nullable: false),
                    SubmittedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false)
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
                name: "WritingResults");

            migrationBuilder.DropTable(
                name: "WritingSubmissions");

            migrationBuilder.DropTable(
                name: "WritingTests");
        }
    }
}
