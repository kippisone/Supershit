const path = require('path');
const co = require('co');

const SuperFS = require('superfs');
// const createModule = require('../modules/createModule');

class ProjectManager {
    static getProjectName(projectName) {
      if (/^\.{1,2}($|\/)/.test(projectName)) {
        return path.basename(path.join(process.cwd(), projectName))
      }

      if (!/^[a-zA-Z0-9_.-]+$/.test(projectName)) {
        throw 'Invalid project name! Only a-z A-Z 0-9 _ . - are allowed in project names.';
      }

      return projectName
    }

  static getProjectDir(projectName, projectDir) {
    if (/^\.{1,2}($|\/)/.test(projectName) && !projectDir) {
      return path.join(process.cwd(), projectName)
    }

    return path.join(process.cwd(), projectDir ? projectDir : projectName)
  }

  static createProject(projectName, projectDir) {
    return co(function *() {
      const srcDir = path.join(__dirname, '../../drafts/project/')
      const destDir = ProjectManager.getProjectDir(projectDir)

      yield SuperFS.copyDir(srcDir, destDir, true)

      //Write packege.json
      const pkg = require(path.join(projectDir, 'package.json'));
      pkg.name = projectName;

      const dest = path.join(projectDir, 'package.json')
      yield SuperFS.writeFile(dest, JSON.stringify(pkg, null, '  '))
    });
  }
}

module.exports = ProjectManager
