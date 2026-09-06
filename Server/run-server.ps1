Start-Process powershell -ArgumentList "-NoExit", "-Command", "dotnet run --project .\Server\Server.csproj"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "dotnet run --project .\RenewalWorker\RenewalWorker.csproj"
