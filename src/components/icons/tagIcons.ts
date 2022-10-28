import { FC } from 'react'
import Blunt from '../../images/filter-icons/blunt.svg'
import Dice from '../../images/filter-icons/dice.svg'
import Drop from '../../images/filter-icons/drop.svg'
import DrugPill from '../../images/filter-icons/drug-pill.svg'
import DrugPills from '../../images/filter-icons/drug-pills.svg'
import Ear from '../../images/filter-icons/ear.svg'
import Fist from '../../images/filter-icons/fist.svg'
import GameController from '../../images/filter-icons/game-controller.svg'
import Heartbeat from '../../images/filter-icons/heartbeat.svg'
import Hiv from '../../images/filter-icons/hiv.svg'
import People from '../../images/filter-icons/people.svg'
import Pizza from '../../images/filter-icons/pizza.svg'
import PregnancyTest from '../../images/filter-icons/pregnancy-test.svg'
import Stetoscope from '../../images/filter-icons/stetoscope.svg'
import Transgender from '../../images/filter-icons/transgender.svg'
import Wind from '../../images/filter-icons/wind.svg'
import WineGlas from '../../images/filter-icons/wine-glas.svg'

type IconElement = FC<{
  className?: string
  'aria-label'?: string
}>

export default {
  blunt: Blunt as IconElement,
  dice: Dice as IconElement,
  drop: Drop as IconElement,
  'drug-pill': DrugPill as IconElement,
  'drug-pills': DrugPills as IconElement,
  ear: Ear as IconElement,
  fist: Fist as IconElement,
  'game-controller': GameController as IconElement,
  heartbeat: Heartbeat as IconElement,
  hiv: Hiv as IconElement,
  people: People as IconElement,
  pizza: Pizza as IconElement,
  'pregnancy-test': PregnancyTest as IconElement,
  stetoscope: Stetoscope as IconElement,
  transgender: Transgender as IconElement,
  wind: Wind as IconElement,
  'wine-glas': WineGlas as IconElement,
}
