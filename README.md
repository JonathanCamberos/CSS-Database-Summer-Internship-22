# CSS-Database-Summer-Internship-22

Notes - there is public VIEW access to the College Success Scholars Database via this [link](https://docs.google.com/spreadsheets/d/1Urx86Jjewe84lbw9ev44Plo6WWFcsxpU2sjBTzKxn1c/edit?usp=sharing)

Public Repository for CSS Database Development
The Github Copy of the CSS Database is a testing code base for the real CSS Database hosted on Google Apps Script.

Notes- 

Finished! 9-7-22
database is complete! Parser and summaries are functional as well as Weekly Memo qeuries.
Need to clean up Weekly Memo but is functional right now!

8-8-22
database is near 70% completion, will begin merging documentation soon

## Requirements

1. You should have edit access to the [CSS Summer Internship Database](https://docs.google.com/spreadsheets/d/1Urx86Jjewe84lbw9ev44Plo6WWFcsxpU2sjBTzKxn1c/edit?usp=sharing)

2. You should have edit accress to the [CSS Summer Internship Database Script](https://docs.google.com/spreadsheets/d/1Urx86Jjewe84lbw9ev44Plo6WWFcsxpU2sjBTzKxn1c/edit?usp=sharing)

2.5  You should have accress to the [CSS Summer Professional Resources Database](https://docs.google.com/spreadsheets/d/1k40aol-a1_iJxkJW8Wcb41tijvK63XSadimy5CVV098/edit?usp=sharing)

3. Access to the CSS Sumer Internship Database Script on Git

4. You should have VSCode, [Typescript](https://www.typescriptlang.org/docs/handbook/basic-types.html), Clasp, and Git installed. If not, follow the steps in the [subsequent section](#tools-setup).

5. Otherwise, [skip](#development-setup).

## Tools Setup

1. Follow [these steps](https://developers.google.com/apps-script/guides/clasp) to download `clasp` on your computer (do not clone yet)

2. Type the following commands into the termincal (MACOS)

```bash
npm install -g typescript
npm install -S @types/google-apps-script
npm install -S eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-config-prettier
```

3. Download the [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and [Prettier extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

4. Go to VSCode and press `cmd-shift-P` and type `Open Settings (JSON)`. This should open a file called `settings.json`. In the json, add this:

```json
...
  "editor.codeActionsOnSave": {
	"source.fixAll.eslint": true
	},
...
```


## Development Setup

1. Clone the `Development CSS Database` from Git, then `cd` into it

2. The following command allows you to push files onto the `Development CSS Database Script` on Google Apps Script

```bash

echo  "{\"scriptId\":\"19VGR8O_ErPukBEeEClEFVWWHzZKW3O_Sqd7xvJ7MRmqN4DEqgiB_bTAl\"}" > .clasp.json

```

3. You should now have a working directory with `.ts` files and other linting files.


## Workflow

1. Take a upgrade for the Database, and give it a name ex) `UpgradeName`

2. Take the upgrade and split it into subtasks, and name them ex) `TaskName`

3. Make a branch from the `Development CSS Database` repository, and name it `{UpgradeName}_{ActionableItemName}`

4. To see the behavior of your code, you will use `clasp push -w`, which pushes changes as you make them to the `Development CSS Database Script`. (*Git is only for there to be **multiple projects** at the same time on the same code*)

5. Then, when you believe the code is ready for review, make a [Pull Request](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request). On GitHub Desktop, on your branch, you can press `cmd-r`  **Fill out all information**. Then request a code review.
6. Upon passing the code review, merge the branch to`master`
7. Then the owner of the repository will perform a `clasp push` on the master branch to `CSS Database Script`
8. Test the consequences of the code on the real CSS Database!

## License

[MIT](https://choosealicense.com/licenses/mit/)
