using System.Text;
using EcomBackend.Api.Endpoints;
using EcomBackend.Application.Interfaces;
using EcomBackend.Domain.Interfaces;
using EcomBackend.Infrastructure.Data;
using EcomBackend.Infrastructure.Repositories;
using EcomBackend.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo 
    { 
        Title = "E-Commerce API", 
        Version = "1.0.0",
        Description = "Backend API pour l'application e-commerce Hasilaza"
    });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? "YourSuperSecretKeyThatIsAtLeast32CharactersLong!"))
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.WithOrigins(
                "http://localhost:3000",
                "http://localhost:3001",
                "https://yoobouko-hasilazamotor.com",
                "https://www.yoobouko-hasilazamotor.com",
                "https://admin.yoobouko-hasilazamotor.com"
              )
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<CategoryService>();
builder.Services.AddScoped<OrderStatusService>();
builder.Services.AddScoped<UserRoleService>();
builder.Services.AddScoped<SparePartService>();
builder.Services.AddScoped<RepairRequestService>();
builder.Services.AddScoped<ISparePartOrderService, SparePartOrderService>();
builder.Services.AddScoped<SparePartCategoryService>();
builder.Services.AddScoped<DashboardService>();

var app = builder.Build();

// Apply migrations at startup - required for new tables
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    
    try
    {
        logger.LogInformation("Checking for pending migrations...");
        var pendingMigrations = await context.Database.GetPendingMigrationsAsync();
        
        if (pendingMigrations.Any())
        {
            logger.LogInformation("Applying {Count} pending migrations: {Migrations}", 
                pendingMigrations.Count(), string.Join(", ", pendingMigrations));
            await context.Database.MigrateAsync();
            logger.LogInformation("Migrations applied successfully");
        }
        else
        {
            logger.LogInformation("Database is up to date, no migrations needed");
        }
        
        await DbSeeder.SeedAsync(context);
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Migration failed: {Message}", ex.Message);
        // Don't throw - let the app start and handle errors at runtime
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "E-Commerce API V1");
    });
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();

app.MapAuthEndpoints();
app.MapUserEndpoints();
app.MapProductEndpoints();
app.MapProductImageEndpoints();
app.MapProductImageDeleteEndpoints();
app.MapOrderEndpoints();
app.MapCategoryEndpoints();
app.MapOrderStatusEndpoints();
app.MapUserRoleEndpoints();
app.MapSparePartEndpoints();
app.MapSparePartImageEndpoints();
app.MapRepairRequestEndpoints();
app.MapSparePartOrderEndpoints();
app.MapSparePartCategoryEndpoints();
app.MapDashboardEndpoints();

app.MapGet("/", () => Results.Ok(new 
{ 
    message = "E-Commerce API Hasilaza",
    version = "1.0.0",
    documentation = "/swagger",
    endpoints = new[] { "/api/auth", "/api/users", "/api/products", "/api/orders" }
}))
.WithName("Root")
.WithOpenApi();

app.Run();
