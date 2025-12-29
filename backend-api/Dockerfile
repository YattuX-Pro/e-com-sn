FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["src/EcomBackend.Api/EcomBackend.Api.csproj", "src/EcomBackend.Api/"]
COPY ["src/EcomBackend.Application/EcomBackend.Application.csproj", "src/EcomBackend.Application/"]
COPY ["src/EcomBackend.Domain/EcomBackend.Domain.csproj", "src/EcomBackend.Domain/"]
COPY ["src/EcomBackend.Infrastructure/EcomBackend.Infrastructure.csproj", "src/EcomBackend.Infrastructure/"]
RUN dotnet restore "src/EcomBackend.Api/EcomBackend.Api.csproj"
COPY . .
WORKDIR "/src/src/EcomBackend.Api"
RUN dotnet build "EcomBackend.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "EcomBackend.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "EcomBackend.Api.dll"]
