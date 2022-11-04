# octoherd-script-create-issue-templates

> Create PRs to add issue templates across repositories.

The tool will scan the `templates` directory to determine issue templates. It will create an issue template for each file there, branch off of the latest default branch commit, and create a PR with the issue templates added.

To PR issue templates to `owner/repoName`, call:

```bash
node ./cli.js -T ${GITHUB_TOKEN} -R owner/repoName
```

Note that you must give the octoherd CLI permission for requests (granted interactively in the script).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## About Octoherd

[@octoherd](https://github.com/octoherd/) is a project to help you keep your GitHub repositories in line.

## License

[ISC](LICENSE.md)
