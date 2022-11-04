# octoherd-script-create-issue-templates

> Create PRs to add issue templates across repositories.

The tool will scan the given directory to determine issue templates. It will create an issue template for each file there, branch off of the latest default branch commit, and create a PR with the issue templates added.

To PR issue templates present in `$(pwd)/templates` to `owner/repoName`, call:

```bash
node ./cli.js -T ${GITHUB_TOKEN} -R owner/repoName --template-directory $(pwd)/templates
```

To apply to more than one repository at once, simply give additional space-delimited `owner/repoName` pairs.

Note that you must either give the octoherd CLI permission for requests (granted interactively in the script)
or else pass `--octoherd-bypass-confirms true` to the script.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## About Octoherd

[@octoherd](https://github.com/octoherd/) is a project to help you keep your GitHub repositories in line.

## License

[ISC](LICENSE.md)
