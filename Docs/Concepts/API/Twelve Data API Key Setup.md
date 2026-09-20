# Twelve Data API key environment variable

The API reads its Twelve Data key from configuration rather than hardcoding it in `QuotesController.cs`. These steps use macOS and zsh.

## 1. Set the variable

In a terminal, replace the placeholder with your actual key:

```zsh
export TwelveData__ApiKey="YOUR_API_KEY"
```

Use exactly `TwelveData__ApiKey`, with **two underscores**. .NET maps those underscores to the configuration separator, so the controller reads it as:

```csharp
var apiKey = _configuration["TwelveData:ApiKey"];
```

The folder where you run `export` does not matter. The variable belongs to that terminal session and is inherited by processes started from it. Changing folders preserves it.

## 2. Verify it is set

Run this in the same terminal to check without printing the key:

```zsh
if [[ -n "$TwelveData__ApiKey" ]]; then
  echo "API key is set"
else
  echo "API key is missing or empty"
fi
```

This confirms the variable is nonempty in this terminal; it does not validate the key with Twelve Data.

## 3. Start the API from that terminal

Stop any existing API instance. Navigate to the repository root, then run:

```zsh
dotnet run --project financeAPI/financeAPI.csproj
```

An already-running API will not receive a variable exported afterward. An API started in another terminal or through the IDE debugger may not inherit it either.

## 4. Test with Bruno

Send a GET request using the scheme and port printed by `dotnet run`:

```text
GET <API_BASE_URL>/api/quotes?symbol=AAPL
```

Bruno does not need the Twelve Data API key. Your API reads the variable and authenticates its outgoing request to Twelve Data.

A successful quote response with the hardcoded key removed confirms the setup works end to end.

## Optional: persist across terminal sessions

Add this line to `~/.zshrc`, substituting your actual key:

```zsh
export TwelveData__ApiKey="YOUR_API_KEY"
```

Open a new zsh terminal, or load the file in the current terminal:

```zsh
source ~/.zshrc
```

Start the API from that terminal. This configures zsh sessions; it does not automatically configure an IDE debugger launched separately. Keep the actual key out of repository files and commits.

## Troubleshooting: HTTP 500 for a missing key

If the response says `Twelve Data API key is not configured.`:

1. Check the variable name has two underscores and matches the capitalization above.
2. Run the verification command in the terminal that will start the API.
3. Stop the API and restart it from that same terminal.
4. Ensure Bruno targets the port of the restarted instance.

The relevant distinction is the terminal/process environment, not the folder where the variable was set.
