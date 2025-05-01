"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StackService = void 0;
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
const body_input_validators_1 = require("../validators/body.input.validators");
class StackService {
    prisma = new client_1.PrismaClient({
        log: ["error"]
    });
    async createStack(stack) {
        let { error } = body_input_validators_1.StackSchema.validate(stack);
        if (error) {
            return ({
                'success': false,
                'error': error.details[0].message
            });
        }
        ;
        let stackExists = await this.prisma.stack.findUnique({ where: { Name: stack.Name.toLocaleLowerCase() } });
        if (stackExists) {
            return {
                'success': false,
                'error': 'Stack already exists.'
            };
        }
        let { StackId, Problems, ProjectStructures, Name, ...r_stack } = stack;
        let create = await this.prisma.stack.create({
            data: {
                StackId: (0, uuid_1.v4)(),
                ...r_stack,
                Name: stack.Name.toLocaleLowerCase()
            }
        });
        if (create == null) {
            return {
                'success': false,
                'error': 'Unable to create stack'
            };
        }
        else {
            return {
                'success': true,
                'message': 'Stack created successfully'
            };
        }
    }
    async updateStack(StackId, stack) {
        let { error } = body_input_validators_1.StackSchema.validate(stack);
        if (error) {
            return ({
                'success': false,
                'error': error.details[0].message
            });
        }
        ;
        let stackExists = await this.prisma.stack.findUnique({ where: { StackId } });
        if (stackExists == null) {
            return {
                'success': false,
                'error': 'Stack not found'
            };
        }
        else {
            let update = await this.prisma.stack.update({
                where: { StackId },
                data: {
                    ...stack
                }
            });
            if (update == null) {
                return {
                    'success': false,
                    'error': 'Unable to update stack'
                };
            }
            else {
                return {
                    'success': true,
                    'message': 'Stack updated successfully'
                };
            }
        }
    }
    async deleteStack(StackId) {
        let stackExists = await this.prisma.stack.findUnique({ where: { StackId } });
        if (stackExists == null) {
            return {
                'success': false,
                'error': 'Stack not found'
            };
        }
        else {
            let delete_ = await this.prisma.stack.delete({
                where: { StackId }
            });
            if (delete_ == null) {
                return {
                    'success': false,
                    'error': 'Unable to delete stack'
                };
            }
            else {
                return {
                    'success': true,
                    'message': 'Stack deleted successfully'
                };
            }
        }
    }
    async getAllStacks() {
        let stacks = await this.prisma.stack.findMany();
        if (stacks == null) {
            return {
                'success': false,
                'error': 'No stacks found'
            };
        }
        else {
            return {
                'success': true,
                'message': 'Stacks retrieved successfully.',
                'stacks': stacks
            };
        }
    }
    async getSingleStack(StackId) {
        let stackExists = await this.prisma.stack.findUnique({ where: { StackId } });
        if (stackExists == null) {
            return {
                'success': false,
                'error': 'Stack not found'
            };
        }
        return {
            'success': true,
            'message': 'Stack retrieved successfully.',
            'stack': stackExists
        };
    }
}
exports.StackService = StackService;
