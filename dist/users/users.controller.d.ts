import { UsersService } from './users.service';
import { TasksService } from '../tasks/tasks.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    private readonly tasksService;
    constructor(usersService: UsersService, tasksService: TasksService);
    findAll(): import("./users.service").User[];
    search(email: string): import("./users.service").User;
    findOne(id: number): import("./users.service").User;
    findTasks(id: number): import("../tasks/tasks.service").Task[];
    create(createUserDto: CreateUserDto): import("./users.service").User;
    update(id: number, updateUserDto: UpdateUserDto): import("./users.service").User;
    remove(id: number): import("./users.service").User;
}
