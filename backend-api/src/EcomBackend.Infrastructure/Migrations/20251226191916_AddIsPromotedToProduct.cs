using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EcomBackend.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddIsPromotedToProduct : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsPromoted",
                table: "Products",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsPromoted",
                table: "Products");
        }
    }
}
