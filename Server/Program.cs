using SubTrack.Authentication.Interfaces;
using SubTrack.Authentication.Middlewares;
using SubTrack.Authentication.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SubTrack.Notifications.Interfaces;
using SubTrack.Notifications.Services;
using SubTrack.Payments.Interfaces;
using SubTrack.Payments.Services;
using SubTrack.Data;
using SubTrack.Subscriptions.Interfaces;
using SubTrack.Subscriptions.Services;
using System.Text;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

//IOC[Inversion of Control] Container - created and injects the dependencies

// Register Controllers
builder.Services.AddControllers();

// Register DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

// Register Services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ISubscriptionService, SubscriptionService>();
builder.Services.AddScoped<IPaymentService, PaymentService>();
builder.Services.AddScoped<INotificationService, NotificationService>();

// Register Json to string conversion
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
});

// Register JWT token validation middleware
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = builder.Configuration["TokenDetails:Issuer"],
        ValidateAudience = true,
        ValidAudience = builder.Configuration["TokenDetails:Audience"],
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["TokenDetails:SigningKey"]!)),
        ValidateLifetime = true
    };
});

// Register CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("ClientPolicy", Policy =>
    {
        Policy
            .AllowAnyOrigin()
            //.WithOrigins(builder.Configuration.GetSection(("Cors:Origin").Get<string[]>()!)
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

// Middleware pipeline 

app.UseHttpsRedirection();

app.UseMiddleware<GlobalExceptionMiddleware>(); // GlobalException middleware

app.UseCors("ClientPolicy"); // add CORS to middleware

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

