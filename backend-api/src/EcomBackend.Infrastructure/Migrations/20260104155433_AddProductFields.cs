using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EcomBackend.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddProductFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CapaciteCharge",
                table: "Products",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Etat",
                table: "Products",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TypeCarburant",
                table: "Products",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CapaciteCharge",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "Etat",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "TypeCarburant",
                table: "Products");
        }
    }
}
