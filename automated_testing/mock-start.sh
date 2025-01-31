echo "Installing MongoDB..."
brew tap mongodb/brew
brew install mongodb-community@6.0

echo "Starting MongoDB..."
brew services start mongodb/brew/mongodb-community@6.0
echo "Waiting for MongoDB to be ready..."
until nc -z localhost 27017; do
echo "MongoDB is not ready yet, retrying in 5 seconds..."
sleep 5
done

echo "Creating test database and collection..."
mongosh <<EOF
use test
db.test.insertMany([
{ name: "test1", value: 1 },
{ name: "test2", value: 2 },
{ name: "test3", value: 3 }
])
EOF

if [ "$ACP_ENV" = true ]; then
    echo "Installing WireMock..."
    brew install wiremock-standalone

    echo "Starting WireMock..."
    wiremock --local-response-templating --port 8080 & sleep 5
else
    echo "ACP_ENV env is not set to true. Skipping Wiremock execution."
fi