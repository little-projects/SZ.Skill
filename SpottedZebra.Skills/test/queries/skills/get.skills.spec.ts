import { assert } from 'chai'
import { CREATE_SKILL_WITH_NAME, DELETE_SKILL_WITH_ID } from '../../../graphQl-config/mutations'
import { sendMutation, sendQuery } from '../../../helpers/graphql'

import { type IGetAllResponse } from '../../../types/responses/get-all-response.interface'

import { type Skill } from '../../../types/skill.interface'
import { GET_SKILLS } from '../../../graphQl-config/queries'
import { genRandomString } from '../../../helpers/gen-skills'

describe('GET Skills: Users can query a list of skills', async function () {
  after(async () => {
    const allSkills = await sendMutation(GET_SKILLS) as IGetAllResponse

    if (allSkills.data.Skills) {
      allSkills.data.Skills.forEach(async (skill: Skill) => {
        await sendMutation(DELETE_SKILL_WITH_ID(skill.id))
      })
    }
  })

  it('The list of skills data can be empty', async function () {
    const response = await sendQuery(GET_SKILLS) as IGetAllResponse

    if (response.data.Skills?.length) {
      console.info('The list of skils data was not found to be empty - skipping test')
      this.skip()
    }
    assert.equal(response.data.Skills?.length, 0)
  })

  it('All skills must have a unique name', async () => {
    const skillsSampleSize = 4
    for (let i = 0; i < skillsSampleSize; i++) {
      const randomSkillName = genRandomString()
      await sendMutation(CREATE_SKILL_WITH_NAME(randomSkillName))

      // Purpously attempt to create duplicate skills (fixed in bug #123)
      if (i && i % 2) {
        await sendMutation(CREATE_SKILL_WITH_NAME(randomSkillName))
      }
    }
    const response = await sendQuery(GET_SKILLS) as IGetAllResponse

    const uniqueSkills: string[] = [...new Set((response).data.Skills?.map((skill: Skill) => skill.name))]
    assert.equal(response.data.Skills?.length, uniqueSkills.length)
  }).timeout(5000)

  it('Skills are given incremental IDs')
})
