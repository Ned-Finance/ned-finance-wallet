pnpm run build
isolate
cp -R ../../patches ./isolate/
cp .env ./isolate/
cp app.prod.yaml ./isolate/
cp env.prod.yaml ./isolate/
cp -R src ./isolate/
cp tsconfig* ./isolate/
cp ned-wallet-firebase-admin.json ./isolate/
cd isolate
gcloud app deploy --quiet --project=ned-wallet --account=marco@ned.finance app.prod.yaml
cd ..
rm -rf isolate
rm -rf dist