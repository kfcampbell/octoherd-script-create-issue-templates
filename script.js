// @ts-check

import * as fs from 'fs';
import path from 'path';

/**
 * generates PRs for octokit  repos
 *
 * @param {import('@octoherd/cli').Octokit} octokit
 * @param {import('@octoherd/cli').Repository} repository
 */
export async function script(octokit, repository, options) {

  // get list of all files in templates directory
  const files = fs.readdirSync('./templates');

  // iterate through files and store the string content of each file
  const templates = await Promise.all(
    files.map(async (file) => {
      // read the string content of each file in the templates directory
      const template = await fs.promises.readFile(
        path.join('./templates', file),
        'utf8'
      );
      return {
        name: file,
        content: template,
      };
    })
  );

	// get SHA of latest default branch commit
	const { data: { object: { sha } } } = await octokit.request("GET /repos/{owner}/{repo}/git/ref/{ref}", {
		owner: repository.owner.login,
		repo: repository.name,
		ref: `heads/${repository.default_branch}`,
	});

	// create a branch called "octoherd-script-PR" off of the latest SHA
	const branch = await octokit.request("POST /repos/{owner}/{repo}/git/refs", {
		owner: repository.owner.login,
		repo: repository.name,
		ref: "refs/heads/octoherd-script-PR",
		sha: sha,
	});

	// iterate through templates and add each to the branch "octoherd-script-PR"
	for (const template of templates) {
		await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
			owner: repository.owner.login,
			repo: repository.name,
			path: `.github/ISSUE_TEMPLATE/${template.name}.yml`,
			message: `feat: add ${template.name} issue template`,
			content: Buffer.from(template.content).toString("base64"),
			branch: branch.data.ref,
		});
	}

	// create a PR with a new issue templates
	const { data: pull } = await octokit.request("POST /repos/{owner}/{repo}/pulls", {
		owner: repository.owner.login,
		repo: repository.name,
		title: "Add issue templates",
		body: "This PR adds our standardized issue templates",
		head: "octoherd-script-PR",
		base: "main",
	});
	octokit.log.info({ pull: pull }, "pull");
}
