"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PSGService = void 0;
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
const body_input_validators_1 = require("../validators/body.input.validators");
class PSGService {
    prisma = new client_1.PrismaClient({
        log: ["error"]
    });
    async createPSG(ProjectId, psg) {
        let { error } = body_input_validators_1.PSGSchema.validate(psg);
        if (error) {
            return ({
                'success': false,
                'error': error.message
            });
        }
        ;
        let projectExists = await this.prisma.projectStructure.findUnique({
            where: {
                ProjectId
            }
        });
        if (projectExists == null) {
            return {
                'success': false,
                'message': 'Project not found'
            };
        }
        let { PSGId, ...r_psg } = psg;
        let create = await this.prisma.pSG.create({
            data: {
                ...r_psg,
                PSGId: (0, uuid_1.v4)(),
                ProjectId: projectExists.ProjectId
            }
        });
        if (create == null) {
            return {
                'success': false,
                'error': 'Unable to create structure guide.'
            };
        }
        else {
            return {
                'success': true,
                'message': 'Structure guide created successfully.',
                'psg': create
            };
        }
    }
    async updatePSG(pSGId, psg) {
        let { error } = body_input_validators_1.PSGSchema.validate(psg);
        if (error) {
            return ({
                'success': false,
                'error': error.message
            });
        }
        ;
        let psgExists = await this.prisma.pSG.findUnique({
            where: {
                PSGId: pSGId
            }
        });
        if (psgExists == null) {
            return {
                'success': false,
                'error': 'Structure guide not found'
            };
        }
        let { PSGId, ProjectId, ...r_psg } = psg;
        let update = await this.prisma.pSG.update({
            where: {
                PSGId: psgExists.PSGId
            },
            data: {
                ...psg
            }
        });
        if (update == null) {
            return {
                'success': false,
                'error': 'Unable to update structure guide.'
            };
        }
        else {
            return {
                'success': true,
                'message': 'Structure guide updated successfully.'
            };
        }
    }
    async deletePSG(PSGId) {
        let psgExists = await this.prisma.pSG.findUnique({
            where: {
                PSGId
            }
        });
        if (psgExists == null) {
            return {
                'success': false,
                'error': 'Structure guide not found'
            };
        }
        let delete_ = await this.prisma.pSG.delete({
            where: {
                PSGId: psgExists.PSGId
            }
        });
        if (!delete_) {
            return {
                'success': false,
                'error': 'Unable to remove structure guide.'
            };
        }
        else {
            return {
                'success': true,
                'message': 'Structure guide removed successfully.'
            };
        }
    }
    async getPSGsByProject(ProjectId) {
        let projectExists = await this.prisma.projectStructure.findUnique({
            where: {
                ProjectId
            }
        });
        if (projectExists == null) {
            return {
                'success': false,
                'error': 'Project not found'
            };
        }
        let psgs = await this.prisma.pSG.findMany({
            where: {
                ProjectId: projectExists.ProjectId
            },
            include: {
                Project: true,
                RelatedProblems: true,
                RelatedSolutions: true
            }
        });
        if (psgs == null) {
            return {
                'success': false,
                'error': 'No structure guides found for this project'
            };
        }
        else {
            return {
                'success': true,
                'message': 'Structure guides retrieved successfully.',
                'psgs': psgs
            };
        }
    }
}
exports.PSGService = PSGService;
