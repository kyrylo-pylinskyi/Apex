FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 4000

ENV ASPNETCORE_URLS=http://+:4000

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["api/Apex.csproj", "api/"]
RUN dotnet restore "api\Apex.csproj"
COPY . .
WORKDIR "/src/api"
RUN dotnet build "Apex.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Apex.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Apex.dll"]
