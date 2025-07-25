import { Component, OnInit } from '@angular/core';
import { EmpService } from '../../services/emp-service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BdtFormatPipe } from "../../pipe/bdt-format-pipe";

@Component({
  selector: 'app-employee-profile',
  imports: [CommonModule, BdtFormatPipe, RouterLink],
  templateUrl: './employee-profile.html',
  styleUrl: './employee-profile.css'
})
export class EmployeeProfile implements OnInit {
  employee: any;

  constructor(private empService: EmpService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.empService.getEmp(id).subscribe(emp => this.employee = emp);
  }
}
