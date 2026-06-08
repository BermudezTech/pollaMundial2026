import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async login(email: string, contrasena: string) {
    const user = await this.prisma.usuario.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(
      contrasena,
      user.contrasena_hash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return {
      uuid: user.id,
      nombre: user.nombre,
    };
  }

  async resetPassword(uuid: string, contrasena: string) {
    const user = await this.prisma.usuario.findUnique({
      where: { id: uuid },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const salt = await bcrypt.genSalt(10);
    const contrasena_hash = await bcrypt.hash(contrasena, salt);

    await this.prisma.usuario.update({
      where: { id: uuid },
      data: { contrasena_hash },
    });

    return { message: 'Contraseña actualizada exitosamente' };
  }
}
