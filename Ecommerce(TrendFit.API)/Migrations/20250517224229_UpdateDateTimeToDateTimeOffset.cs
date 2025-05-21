using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce_TrendFit.API_.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDateTimeToDateTimeOffset : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Add temporary column
            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "CreatedAtTemp",
                table: "Users",
                type: "datetimeoffset",
                nullable: false,
                defaultValue: DateTimeOffset.UtcNow);

            // Convert data
            migrationBuilder.Sql(@"
        UPDATE Users 
        SET CreatedAtTemp = TODATETIMEOFFSET(CreatedAt, 0)
    ");

            // Remove old column
            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Users");

            // Rename new column
            migrationBuilder.RenameColumn(
                name: "CreatedAtTemp",
                table: "Users",
                newName: "CreatedAt");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "Users",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTimeOffset),
                oldType: "datetimeoffset");
        }
    }
}
