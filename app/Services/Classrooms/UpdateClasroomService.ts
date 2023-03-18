import BadRequestException from "App/Exceptions/BadRequestException";
import NotFoundException from "App/Exceptions/NotFoundException";
import UnauthorizedException from "App/Exceptions/UnauthorizedException";
import Classroom from "App/Models/Classroom";
import Teacher from "App/Models/Teacher";

interface IRequest {
  teacherId: string;
  classNumber: number;
  capacity: number;
  availability: boolean;
  id: number;
}

export class UpdateClassroomService {
  async execute({ teacherId, classNumber, capacity, availability, id }: IRequest) {
    const classroom = await Classroom.find(id);

    if (!classroom) {
      throw new NotFoundException('Sala de aula não encontrada.');
    }

    const teacher = await Teacher.find(teacherId);

    if (!teacher) {
      throw new NotFoundException('Professor responsável não encontrado.');
    }

    if (classroom.created_by !== teacher.id) {
      throw new UnauthorizedException('Você não está autorizado a editar esta sala de aula.');
    }

    const classNumberAlreadyExists = await Classroom.findBy('class_number', classNumber);

    if (classNumberAlreadyExists) {
      throw new BadRequestException('Este número de classe já foi utilizado por outro professor.')
    }

    await classroom.load('students');

    const enrolledStudents = classroom.students.length;

    if (capacity < enrolledStudents) {
      throw new BadRequestException('A capacidade não pode ser menor que a quantidade alunos já matriculados.');
    }

    classroom.class_number = classNumber ?? classNumber;
    classroom.capacity = capacity ?? capacity;
    classroom.availability = availability ?? availability;

    await classroom.save();

    return {
      message: 'Sala de aula atualizada com sucesso!',
      data: classroom
    }
  }
}