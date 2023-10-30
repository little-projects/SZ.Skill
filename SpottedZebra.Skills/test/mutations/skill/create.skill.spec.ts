import { assert } from 'chai'

import { ExpectedErrors } from '../../../types/expected-errors.enum'
import { type ICreateSkill } from '../../../types/responses/create-skill-response.interface'
import { type IError } from '../../../types/responses/error.interface'
import { type IGetAllResponse } from '../../../types/responses/get-all-response.interface'
import { type Skill } from '../../../types/skill.interface'

import { skillsArray as skillsList } from '../../../fixtures/skills'

import { sendMutation } from '../../../helpers/graphql'
import { GET_SKILLS } from '../../../graphQl-config/queries'
import { CREATE_SKILL_WITH_NAME, DELETE_SKILL_WITH_ID } from '../../../graphQl-config/mutations'

describe('PUT SkillCreateOne: Users can create an individual skill', async () => {
  let skillName: string = skillsList[Math.floor(Math.random() * skillsList.length)]/* .replace(/['"]+/g, '') */
  let created: boolean = false

  // Clean up the data created in each test
  afterEach(async () => {
    if (created) {
      const allSkills = await sendMutation(GET_SKILLS) as IGetAllResponse

      if (allSkills.data.Skills) {
        allSkills.data.Skills.forEach(async (skill: Skill) => {
          await sendMutation(DELETE_SKILL_WITH_ID(skill.id))
        })
      }
    }
  })

  // 'SELECT * FROM Skills' / 'INSERT INTO Skills VALUES(?)'
  it('A new skill can be created from a unique string value', async () => {
    // Single word, double word, multi-word
    const newSkillMutation: string = CREATE_SKILL_WITH_NAME(skillName)
    const response = await sendMutation(newSkillMutation) as ICreateSkill

    assert.equal(response.data.SkillCreateOne.name, skillName)
    created = true
  })

  it.skip('A new skill must contain three or more characters', async () => {
    const invalidSkillName = ''
    const response = await sendMutation(CREATE_SKILL_WITH_NAME(invalidSkillName)) as IError

    assert.equal(response.data, { SkillCreateOne: null })
    assert.equal(response.errors.length, 1) // More than one error might occur if more validation is introduced
    assert.equal(response.errors[0].message, ExpectedErrors.ERROR_OCCURED)
  })

  const patterRestrict = '\'"^[!?.^<>#*{}]+$\\/'
  for (let i = 0; i < patterRestrict.length; i++) {
    const charUnderTest: string = patterRestrict[i]
    it(`A new skill cannot be created with the special character: ${charUnderTest}`, async () => { // leading / trailing spaces etc.
      skillName = `InputValidation_${charUnderTest}`
      // 'response' is declared but its value is never read.
      await sendMutation(CREATE_SKILL_WITH_NAME(skillName))

      assert.fail(`A new skill's name must not contain the character ${charUnderTest}`)
    })
  }

  it('A new skill can be created from a string upto 100 characters', async () => {
    const characterLimit: number = 100 // This wouldn't live in the test
    skillName = 'T'.repeat(characterLimit)

    const mutation = CREATE_SKILL_WITH_NAME(skillName)

    const response = await sendMutation(mutation) as ICreateSkill

    assert.equal(response.data.SkillCreateOne.name, skillName)
    assert.equal(response.data.SkillCreateOne.name.length, characterLimit)

    assert.fail('A new skill\'s name must be no more than 40 characters')
  })

  it('A new skill cannot be created from a string value that already exists', async () => {
    const uniqueSkill = await sendMutation(CREATE_SKILL_WITH_NAME(skillName)) as ICreateSkill
    const duplicateSkill = await sendMutation(CREATE_SKILL_WITH_NAME(skillName)) as IError

    assert.equal(uniqueSkill.data.SkillCreateOne.name, skillName)
    assert.equal(duplicateSkill.data.SkillCreateOne, null)
    assert.equal(duplicateSkill.errors.length, 1) // More than one error might occur if more validation is introduced
    assert.equal(duplicateSkill.errors[0].message, ExpectedErrors.ERROR_OCCURED) // 200 status as this is custom logic
  })

  it('A new skill cannot be assigned a custom ID value', async () => {
    const invalidMutation: string = `mutation automation_invalidNewSkill {
      SkillCreateOne(id: 1, name: "Mocha/Chai Automation Framework") {
        id
        name
      }
    }`
    const errResponse = await sendMutation(invalidMutation) as IError

    assert.equal(errResponse.errors.length, 1)
    assert.equal(errResponse.errors[0].message, 'Unknown argument "id" on field "SkillCreateOne" of type "Mutations".')
  })
})
