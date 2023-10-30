# Intro

<p> Welcome to my <s>Ted Talk</s> Tech Test.</p>

## Setup
Please clone the repo and run `npm i` to install all dependencies (Mocha, Faker, Chai etc.). Once this has completed the tests can be run via the `npm run start` command.

The start command will continue to work if you wish to skip a test, by adding the `.skip` property like so:
```ts
it.skip('A new skill must contain three or more characters', async () => {
    ...
```

A single test can be run using `.only`, for example:
```ts
it.only('#234 A deleted skill should not be visible on a role', async () => {
  ...
```


## My ways of working

I have chopsen to leave in some code around updating skills attached to roles that is not yet suitable for a pull request. I have done this as a) don't know if everybody would agree this is a bug in its own merit and b) to show my ways of working. To set my workings out on paper I essentially write up a bug card and if this turns out to be a quirk of functionality I change `actual behaviour` and `expected behaviour` to `outcome` and `decisions & reasoning`.


> Title: Updating a role with an invalid skill ID sets the skill ID to 0 instead of throwing an error and aborting the mutation

> Description: When updating a role to have a skill with an invalid ID, the skill ID gets set to 0.

#### Repro steps:

1. Create a new skill with a unique string name, noting the ID created (92)
```ts
mutation {
	SkillCreateOne(name: "Making Eggs on Toast") { id name }
}
```
2. Create a new role, noting the ID created (5)
```ts
mutation createRoll {
  RoleCreateOne(name: "Home Cook") {
    id
    name
    skills { id }
  }
}
```
3. Add the newly created skill to the role    - Remember the weights must  add to 1

4. Update the role to have a skill with an invalid ID (e.g. -1)

#### Actual behavior:
The skill ID on the role gets set to 0 instead of throwing an error

#### Expected behavior?
Updating a role with an invalid skill ID should throw an error indicating the ID is invalid and the role is not updated
