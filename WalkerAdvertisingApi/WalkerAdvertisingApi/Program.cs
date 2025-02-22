
using WalkerAdvertisingApi.Services;

namespace WalkerAdvertisingApi;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.

        builder.Services.AddControllers();
        builder.Services.AddSingleton<ILeadStore, InMemoryLeadStore>();
        builder.Services.AddScoped<INotificationService, MockNotificationService>();

        // Configure CORS
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowFrontend", policy =>
            {
                policy.WithOrigins("http://localhost:4200", "http://localhost") // Match frontend origin
                    .AllowAnyMethod() // Allow GET, POST, etc.
                    .AllowAnyHeader(); // Allow Content-Type, etc.
            });
        });

        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        var app = builder.Build();

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        // Apply CORS middleware before routing
        app.UseCors("AllowFrontend");

        app.UseHttpsRedirection();
        app.UseAuthorization();
        app.MapControllers();

        app.Run();
    }
}
