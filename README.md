# 93digital Typing Effect plugin
- https://wordpress.org/plugins/animated-typing-effect/
- http://plugins.svn.wordpress.org/animated-typing-effect/

This plugin was developed a number of years ago by the 93digital development team and is publicly available on the WordPress plugin directory. Ideally we should be testing the plugin with the latest version of WordPress and updating it every couple of months.

The plugin uses both Git and SVN versioning tools.


## SVN
Subversion (SVN) is the VCS of choice for WordPress and the tool which plugin developers must use to update plugins on the directory.

Projects versioned using SVN typically consist of the follwoing root directories (PLEASE DO NOT REMOVE OR RENAME ANY OF THE DIRECTORIES, AS THEY ARE REQUIRED BY WORDPRESS):

### assets/
Contains screenshots, plugin headers and plugin icons used by WordPress. The filenames are specific to what WordPress requires.

### branches/
This is for divergent branches of code, only availabe for developers. This shouldn't need to be touched as we would ideally create a Git branch on Bitbucket instead.

### tags/
Contains older versions of the plugin. WordPress uses this to make older versions available to users. Each directory within this should be named after a version number and contain the contents of the `trunk/` directory at the time of that release.

### trunk/
The main man, the codebase for the plugin. This is where changes and updates need to be made.


## Git
We use Git instead of SVN to version the plugin in our own instance of Bitbucket, within the 93Developers workspace.

This allows all developers to easily access the codebase if required and also allows us to commit and push chnages between official versions. Git branching should be used whenever a developer works on the plugin, even if it just to test the plugin with the latest version of WordPress (more on version numbering below).

SVN is only used to deploy the plugin to the WordPress plugin repository.

### Master branch
The Master branch should mirror the live codebase of the plugin at all times. Developers should never work directly on Master, instead they should be creating a branch to work on amd only merge their changes back into Master when the changes are ready to be pushed to the official plugin repository via SVN.

Currently there are no checks in place to prevent developers commiting or pushing to master - this will be added in time - so for the time being there needs to be an element of trust that everyone is following these instructions.

### Development branches
All development needs to be done on a "version" branches. These branches should be named after the current plugin version you are working on. The version number format should be `vX.X.X`, where each `X` represents and integer (e.g. `v3.1.12`).

The types of verisions are as follows:

1. __Major update:__ This is the left number of the 3 and should only be incremented when a major new feature is added to the plugin, an exisiting feature gets a major overhaul or the plugin code base is rebuilt.  
> _e.g. If the current version is `v1.2.5` and a major new feature is being developed then this should be done on a branch named `v2.0.0`. This will then be the plugin's new version number when the work is complete, merged to master and updated in the WordPress plugin directory._
2. __Minor update:__ This is the middle number of the 3 and should only be incremeneted when undertaking a minor feature update or fixing a major bug within the codebase.  
> _e.g. If the current version is `v1.2.5` and a bug is found or reported then then the fix for this should be done on a new branch named `v1.3.0`. This will then be the plugin's new version number when the work is complete, merged to master and updated in the WordPress plugin directory._
3. __Revision:__ This is the right number of the 3 and is incremented on every minor revision of the plugin, usually when the plugin is tested and updated on the latest version of WordPress (even if no code has been updated in the plugin) or for small bugs fixes (one-liners etc.).  
> _e.g. If the current version is `v1.2.5` and the plugin is to be tested with the latest version of WordPress then the new branch should be `v1.2.6`. This will then be the plugin's new version number when the work is complete, merged to master and updated in the WordPress plugin directory._


## Updating the plugin
The following steps should be followed when officially updating the plugin on for WordPress.

### Methodology
1. Pull down the latest version of the master branch from Bitbucket via Git. It is a good idea to check for any outstanding branches in Bitbucket and, if there are any, check the current status of that branch with the developer who made the last commit as it may have implications on the work you are wanting to do or the version number of your release.
```
# To be run within the plugin's root directory
$ git checkout master
$ git status              # Check there is not outstanding work on the branch
$ git pull origin master  # Pull from Bitbucket once the local branch is clean
```

2. Now check out the plugin from the WordPress plugin repository via SVN.
> _N.B. This SVN check out is necessary as another WordPress account may have access to the plugin and may have made some changes which we dont have on Bitbucket. At the time of writing only the 93digital account has access to our plugins, so this step technically isn't necessary - but its still good practice to run it._
```
# To be run within the plugin's root directory, this can take a while to run so be patient.
$ svn co http://plugins.svn.wordpress.org/animated-typing-effect/ .
```

3. Checkout a new Git branch using the new version as the branch name, check the current plugin version before doing this.
```
# Example version branch
$ git checkout -b v1.2.6
```

4. You can now start working within `trunk/`. No matter what work is being undertaken a few things must always been updated for every version. These are:  
__a.__ The `Tested up to:` property at the top of `README.txt`. This is the version of WordPress that the current version has been tested against.  
__b.__ Version notes under the `== Changelog ==` heading towards the bottom of `README.txt`. These are ordered in version number, newest to oldest.  
__c.__ The `* Version:` property in the top comment block of the plugin's main PHP file.

5. If the work being undertaken is not completed in one sitting, just push your current version branch to Bitbucket. __DO NOT__ push to the plugin repositoty via SVN, we should be releasing updates when necessary (tons of releases is discouraged by WordPress), i.e. when a new version/branch is complete and has been tested.

6. Once the new version is complete, and before it is merged into master, it needs to be added to the `tags/` directory. To do this copy your working version of `trunk/` into `tags/` and rename the directory to the version number you are working on.  
_e.g. `tags/1.2.6`_

7. Now the branch can be merged into master and the feature branch deleted.
```
$ git checkout master
$ git merge 1.2.6      # Example version branch
$ git -d 1.2.6         # Always use a lowercase -d
```

8. Finally we can check in the new version using SVN. This will official release the new version publicly in the WordPress Plugin directiry! You may be prompted to enter credentials in order to successfully check the code in. These details are in 1Password (under __WordPress Plugins Login__ in the shared vault).
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
Similar to `git pull`, pulls the latest version of the codebase from WordPress, should only be run from the root of the SVN repository (where `trunk/`, `tags/` etc. are found).

```
$ svn diff
```
Similar to `git diff`, it shows difference within each changed file, compared to the current live version in the WordPress plugin repository.


## Useful links
- https://developer.wordpress.org/plugins/wordpress-org/how-to-use-subversion/
- https://developer.wordpress.org/plugins/wordpress-org/how-your-readme-txt-works/

- https://stackoverflow.com/questions/86049/how-do-i-ignore-files-in-subversion