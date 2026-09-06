using RenewalWorker;
using RenewalWorker.Configuration;

var builder = WebApplication.CreateBuilder(args);

// Register the worker class, now when this project is build the worker class runs automatically.
builder.Services.AddHostedService<Worker>();

//Register HttpClient
builder.Services.AddHttpClient();

// Register ApiEndpoints
builder.Services.Configure<ApiEndpoints>(
    builder.Configuration.GetSection("ApiEndpoints")
);

// Register Worker Credientials
builder.Services.Configure<WorkerCredientials>(
    builder.Configuration.GetSection("WorkerCred")
);

var app = builder.Build();

app.Run();
