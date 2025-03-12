# Maintain the old version of the frontend
mv ../fe_build ../old_version_dir

# Pull latest BE code
git pull

# Update to latest frontend
cd ../community-deal-fe

git pull

npm run build

formatted_date=$(date +"%Y_%m_%d_%H_%M_%S")
old_version_dir="fe_build_$formatted_date"

mv ./dist ../fe_build


