# 93digital Widget Clone plugin
- hhttps://wordpress.org/plugins/animated-typing-effect/
- http://plugins.svn.wordpress.org/animated-typing-effect/

This plugin was developed a number of years ago by the 93digital development team and is available in the WordPress plugin directory. Ideally we should be testing the plugin with the latest version of WordPress and updating it every month.

The plugin uses both Git and SVN versioning tools.


## Version Control Systems

### SVN
Subversion is the VCS of choice for WordPress and the tool which plugin developers must use to update plugins on the directory.

Projects versioned using SVN typically consist of the follwoing directories in the root of the project (PLEASE DO NOT REMOVE OR RENAME ANY OF THE DIRECTORIES, AS THEY ARE REQUIRED BY WORDPRESS):

#### assets/
Contains screenshots, plugin headers and plugin icons used by WordPress. The filenames are specific to what WordPress requires.

#### branches/
This is for divergent branches of code, only availabe for developers. This shouldn't need to be touched as we version the plugin ourselves between releases.

#### tags/
Contains older versions of the plugin. WordPress uses this to make older versions available to users. Each directory within this should be named after a version number and contain the contents of the trunk/ directory at the time of that release.

#### trunk/
The main man, the codebase for the plugin. This is where changes and updates are made.


### Git
Git is used to keep the plugin's codebase versioned with our own instance of Bitbucket, within the 93Developers workspace.

This allows all developers to easily access the codebase if required and also allows us to commit and push chnages between official versions. Git branching should be used whenever a developer works on the plugin, even if it just a simple monthly update.

#### Master branch
The Master branch should mirror the live codebase of the plugin at all times. Developers should never work directly on Master, instead they shuld be branching off master and only merging their changes in top master when the changes are ready to be pushed to the official plugin repository via SVN.

Currently there are no checks in place to prevent developers commiting or pushing to master - this will be added in time - so for the time being there needs to be an element of trust that everyone is following these instructions.

#### Development branches
All development needs to be done on "version" branches. These branches should be named after the current plugin version you are working on. The version number consists of 3 numbers seperated by dots (e.g. 3.1.12).

The types of verisions are as follows:

1. __Major update:__ This is the left number of the 3 and should only be incremented when a major new feature is added to the plugin, an exisiting feature gets a major overhaul or the plugin code base is rebuilt.  
_e.g. if the current version is 1.2.5 and a major new feature is being developed then this should be done on a branch named 2.0.0, which will be the plugin's new version number when it is completed, merged to master and updated in the WordPress plugin directory._
2. __Minor update:__ This is the middle number of the 3 and should only be incremeneted when undertaking a minor feature update or fixing a major bug within the codebase.  
_e.g. If the current version is 1.2.5 and a bug is found or reported then then the fix for this should be done on a new branch named 1.3.0, which will be the plugin's new version number when it is completed, merged to master and updated in the WordPress plugin directory._
3. __Revision:__ This is the right number of the 3 and is incremented on every minor revision of the plugin. So when the plugin is tested and updated on a monthly basis (even if no code has been updated) or small bugs fixes (one-liners etc.).  
_e.g. If the current version is 1.2.5 and a monthly test and update is due then this should be done on a new branch names 1.2.6, which will be the plugin's new version number once tested and updated, merged to master and updated in the WordPress plugin directory._


## Updating the plugin
The following steps should be followed when attempting to implement and official update to the plugin within the WordPress plugin directory.

### Versioning


### Methodology
1. Pull down the latest of the plugin's master branch from Bitbucket via Git. You should check the repository in Bitbucket for any already outstanding version branches, if there are any, please check the current status of the branch with the developer who posted the last commit.
```
# To be run within the plugin's root directory

$ git checkout master
$ git status              # Check there is not outstanding work on the branch
$ git pull origin master  # Pull from Bitbucket once the local branch is clean
```
2. Check out the plugin from the WordPress plugin repository via SVN. At the tiem of writing we onlt have 2 plugins which only the 93digital WordPress account has access to, so any updates here should also be on Bitbucket - but for arguements sake and to future proof, this is still a good idea.
```
# To be run within the plugin's root directory, this can take a while to run so be patient.

$ svn co http://plugins.svn.wordpress.org/animated-typing-effect/ .
```
3. Branch off into a new version branch.
```
$ git checkout -b 1.2.6  # Example version branch
```
4. You can now start working within `trunk/`. No matter what work is being undertaken a few things must always been updated for every version. These are:
- The `Tested up to:` property at the top of `README.txt`. This is the version of WordPress that the current version has been tested against.
- Version notes under the `== Changelog ==` heading towards the bottom of `README.txt`. These are ordered in version number, newest to oldest.
- The `* Version:` property in the top comment block of the plugin's main PHP file.
5. If the work being undertaken is not completed in one sitting, just push your current version branch to Bitbucket. DO NOT push to the plugin repositoty via SVN, we should only be pushing to this occasionally and once a branch is complete and has been tested.
6. Once the new version is complete, and before it is merged into master, it needs to be added to the `tags/` directory. To do this copy tour working version of `trunk/` into `tags/` and rename the directory to the version number you are working on.  
_e.g. `tags/1.2.6`_
7. Now the branch can be merged into master and the feature branch deleted.
```
$ git checkout master
$ git merge 1.2.6      # Example version branch
$ git -d 1.2.6         # Always use a lowercase -d
```
8. Finally we can check in the new version using SVN, which will update it publicly and show users that the plugin has just been updated. You may be prompted to enter credentials in order to successfully check the code in. These details are in 1Password (user `93digital`).
```
$ svn ci -m "A commit message to explain what has been changed."
```

## Useful SVN commands
```
$ svn stat
```
Similar to `git status`, shows the status of the working directory.

```
$ svn up
```
Pulls the latest version of the codebase from WordPress. Can only be run if the SVN repository is already being tracked in the current working directory

```
$ svn diff
```
Similar to `git diff`, it shows difference within each changed file, compared to the version in the WordPress plugin repository.


## Useful links
- https://developer.wordpress.org/plugins/wordpress-org/how-to-use-subversion/
- https://developer.wordpress.org/plugins/wordpress-org/how-your-readme-txt-works/