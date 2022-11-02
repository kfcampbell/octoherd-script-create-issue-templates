// @ts-check
const bugTemplate = {
  name: "bug",
  content: `name: Bug Report
description: File a bug report
title: "[Bug]: "
labels: ["bug", "triage"]
assignees:
  - octocat
body:
  - type: markdown
    attributes:
      value: |
        Thanks for taking the time to fill out this bug report!
  - type: input
    id: contact
    attributes:
      label: Contact Details
      description: How can we get in touch with you if we need more info?
      placeholder: ex. email@example.com
    validations:
      required: false
  - type: textarea
    id: what-happened
    attributes:
      label: What happened?
      description: Also tell us, what did you expect to happen?
      placeholder: Tell us what you see!
      value: "A bug happened!"
    validations:
      required: true
  - type: dropdown
    id: version
    attributes:
      label: Version
      description: What version of our software are you running?
      options:
        - 1.0.2 (Default)
        - 1.0.3 (Edge)
    validations:
      required: true
  - type: dropdown
    id: browsers
    attributes:
      label: What browsers are you seeing the problem on?
      multiple: true
      options:
        - Firefox
        - Chrome
        - Safari
        - Microsoft Edge
  - type: textarea
    id: logs
    attributes:
      label: Relevant log output
      description: Please copy and paste any relevant log output. This will be automatically formatted into code, so no need for backticks.
      render: shell
  - type: checkboxes
    id: terms
    attributes:
      label: Code of Conduct
      description: By submitting this issue, you agree to follow our [Code of Conduct](https://example.com)
      options:
        - label: I agree to follow this project's Code of Conduct
          required: true
`}

const docTemplate = {
	  name: "doc",
	  content: `name: Documentation
description: Update, add, or improve documentation
title: "[DOCS]: "
labels: ["Type: Documentation", "Status: Triage"]
assignees:
  -
body:
  - type: markdown
    attributes:
      value: |
        Thanks for taking the time to fill this out!
  - type: textarea
    id: describe-need
    attributes:
      label: Describe the need
      description: Also tell us, whats expected?
      placeholder: Why are these updates needed!
      value: "I need the docs!"
    validations:
      required: true
  - type: input
    id: sdk_version
    attributes:
      label: SDK Version
      description: Do these docs apply to a specific SDK version?
      placeholder: ex. v1.1.1
    validations:
      required: false
  - type: input
    id: api_version
    attributes:
      label: REST API Version
      description: Do these docs apply to a specific version of the GitHub REST API?
      placeholder: ex. v1.1.1
    validations:
      required: false
  - type: textarea
    id: logs
    attributes:
      label: Relevant log output
      description: Please copy and paste any relevant source code or log details. This will be automatically formatted into code, so no need for backticks.
      render: shell
  - type: checkboxes
    id: terms
    attributes:
      label: Code of Conduct
      description: By submitting this issue, you agree to follow our [Code of Conduct](https://example.com)
      options:
        - label: I agree to follow this project's Code of Conduct
          required: true`}

const featureTemplate = {
	name: "feature",
	content: `name: Feature
description: Suggest an idea for a new feature or enhancement
title: "[FEAT]: "
labels: ["Type: Feature", "Status: Triage"]
assignees:
  -
body:
  - type: markdown
    attributes:
      value: |
        Thanks for taking the time to fill this out!
  - type: textarea
    id: describe-need
    attributes:
      label: Describe the need
      description: Also tell us, whats expected/wanted?
      placeholder: Why is this feature needed!
      value: "I really need this feature!"
    validations:
      required: true
  - type: input
    id: sdk_version
    attributes:
      label: SDK Version
      description: Does this feature suggestion apply to a specific SDK version?
      placeholder: ex. v1.1.1
    validations:
      required: false
  - type: input
    id: api_version
    attributes:
      label: REST API Version
      description: Does this feature suggestion apply to a specific version of the GitHub REST API?
      placeholder: ex. v1.1.1
    validations:
      required: false
  - type: textarea
    id: logs
    attributes:
      label: Relevant log output
      description: Please copy and paste any relevant source code or log details. This will be automatically formatted into code, so no need for backticks.
      render: shell
  - type: checkboxes
    id: terms
    attributes:
      label: Code of Conduct
      description: By submitting this issue, you agree to follow our [Code of Conduct](https://example.com)
      options:
        - label: I agree to follow this project's Code of Conduct
          required: true`
}

const maintenanceTemplate = {
	name: "maintenance",
	content: `name: Maintenance
description: Dependencies, Cleanup, refactoring, reworking of code
title: "[MAINT]: "
labels: ["Type: Maintenance", "Status: Triage"]
assignees:
  -
body:
  - type: markdown
    attributes:
      value: |
        Thanks for taking the time to fill this out!
  - type: textarea
    id: describe-need
    attributes:
      label: Describe the need
      description: Also tell us, whats expected/wanted?
      placeholder: Why is this maintenance needed!
      value: "The code needs some serious help here!"
    validations:
      required: true
  - type: input
    id: sdk_version
    attributes:
      label: SDK Version
      description: Does this maintenance apply to a specific SDK version?
      placeholder: ex. v1.1.1
    validations:
      required: false
  - type: input
    id: api_version
    attributes:
      label: REST API Version
      description: Does this maintenance apply to a specific version of the GitHub REST API?
      placeholder: ex. v1.1.1
    validations:
      required: false
  - type: textarea
    id: logs
    attributes:
      label: Relevant log output
      description: Please copy and paste any relevant source code or log details. This will be automatically formatted into code, so no need for backticks.
      render: shell
  - type: checkboxes
    id: terms
    attributes:
      label: Code of Conduct
      description: By submitting this issue, you agree to follow our [Code of Conduct](https://example.com)
      options:
        - label: I agree to follow this project's Code of Conduct
          required: true`
}

const templates = [bugTemplate, docTemplate, featureTemplate, maintenanceTemplate]

/**
 * generates PRs for octokit  repos
 *
 * @param {import('@octoherd/cli').Octokit} octokit
 * @param {import('@octoherd/cli').Repository} repository
 */
export async function script(octokit, repository, options) {

	// get SHA of latest default branch commit
	const { data: { object: { sha } } } = await octokit.request("GET /repos/{owner}/{repo}/git/ref/{ref}", {
		owner: repository.owner.login,
		repo: repository.name,
		ref: `heads/${repository.default_branch}`,
	});

	// create a branch called "octoherd-script-PR"
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
