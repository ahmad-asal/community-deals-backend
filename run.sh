# Maintain the old version of the frontend
formatted_date=$(date +"%Y_%m_%d_%H_%M_%S")
old_version_dir="fe_build_$formatted_date"

echo "Backing up old frontend build into $formatted_date"

mv ../fe_build ../"$old_version_dir"

# Pull latest BE code
echo "Pulling BE Code"
git pull

# Update to latest frontend
echo "Pulling FE Code"
cd ../community-deal-fe

git pull

echo "Building FE code"

if npm run build
then
  echo "Successfully built frontend. Deploying new version of FE"

  mv ./dist ../fe_build

  echo "System is updated to latest"

else
  echo "Failed building FE ... exiting"
fi
