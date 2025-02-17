import { PrintProposal } from './printStandard/PrintProposal'
import { PrintProposal as PrintProposalAtendePortaria1 } from './printAtendePortaria1/PrintProposal'
import { PrintProposal as PrintProposalAtendePortaria2 } from './printAtendePortaria2/PrintProposal'
import { PrintProposal as PrintProposalLayoutGenerator } from './printLayoutGenerator/PrintProposal'

import { GenerateFile } from './printStandard/GenerateFile'
import { GenerateFile as GenerateFileAtendePortaria1 } from './printAtendePortaria1/GenerateFile'
import { GenerateFile as GenerateFileAtendePortaria2 } from './printAtendePortaria2/GenerateFile'
import { GenerateFile as GenerateFileLayoutGenerator } from './printLayoutGenerator/GenerateFile'

export const printComponents = {
  printStandard: PrintProposal,
  printAtendePortaria1: PrintProposalAtendePortaria1,
  printAtendePortaria2: PrintProposalAtendePortaria2,
  printLayoutGenerator: PrintProposalLayoutGenerator,
}

export const filePrintComponents = {
  printStandard: GenerateFile,
  printAtendePortaria1: GenerateFileAtendePortaria1,
  printAtendePortaria2: GenerateFileAtendePortaria2,
  printLayoutGenerator: GenerateFileLayoutGenerator,
}
