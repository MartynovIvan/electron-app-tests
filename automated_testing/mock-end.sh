echo "Stop MongoDB..."
brew services stop mongodb-community@6.0



if [ "$ACP_ENV" = true ]; then
    echo "Stop WireMock..."
    pkill -f wiremock
else
    echo "ACP_ENV is not set to true. Skipping Wiremock execution."
fi