using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class addUserintoMilestone : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_MileStones_UserId",
                table: "MileStones",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_MileStones_Users_UserId",
                table: "MileStones",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MileStones_Users_UserId",
                table: "MileStones");

            migrationBuilder.DropIndex(
                name: "IX_MileStones_UserId",
                table: "MileStones");
        }
    }
}
