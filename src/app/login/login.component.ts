import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../router.animations';
import { AuthService } from '../shared/services/auth.service';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit {
    loginForm:FormGroup;
    loginClicked:boolean = false;
    errorMEssage:string = "";
    constructor(
      public router: Router,
      private authService:AuthService,
      private formBuilder: FormBuilder
    ) {}

    ngOnInit() {

        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }
    get f() { return this.loginForm.controls; }
    onLoggedin() {
       // this.authService.login()
       this.loginClicked = true;
       console.log(this.loginForm.value);
       //this.authService.login(this.loginForm.value.username,this.loginForm.value.password).subscribe((res: any) => {
       // if(res.token){
          localStorage.setItem('isLoggedin', 'true');
        //  localStorage.setItem('auth',res.token);
        //}
     // }, err => {
     //   this.errorMEssage = err
     // });;
    //
    }
}
