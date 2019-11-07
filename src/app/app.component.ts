import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  ValidatorFn,
  AbstractControl
} from "@angular/forms";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  name = "Angular";
  contactForm: FormGroup;

  countries = ["USA", "Germany", "Italy", "France"];

  requestTypes = ["Claim", "Feedback", "Help Request"];

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    // this.contactForm = this.createFormGroup();
    this.contactForm = this.createFormGroupWithBuilder();
  }

  createFormGroup() {
    return new FormGroup({
      personalData: new FormGroup({
        email: new FormControl("", Validators.required),
        mobile: new FormControl("0778787876"),
        country: new FormControl(this.countries[0])
      }),
      requestType: new FormControl(this.requestTypes[0]),
      text: new FormControl()
    });
  }

  createFormGroupWithBuilder() {
    return this.formBuilder.group({
      personalData: this.formBuilder.group({
        email: new FormControl("", Validators.required),
        mobile: "",
        country: ""
      }),
      requestType: "",
      text: "",
      age: ["", Validators.compose([this.ageLimitValidator(18, 60)])],
      passwordG: this.formBuilder.group(
        {
          password: new FormControl(
            "",
            Validators.compose([Validators.required])
          ),
          confirmPassword: new FormControl(
            "",
            Validators.compose([Validators.required])
          )
        },
        {
          // our validator for the form group
          validator: this.passwordMatchValidator
        }
      )
    });
  }

  createFormGroupWithBuilderAndModel() {
    return this.formBuilder.group({
      personalData: this.formBuilder.group(new PersonalData("qwdqwd@qwd.com")),
      requestType: "",
      text: ""
    });
  }

  passwordMatchValidator(control: AbstractControl) {
    const password: string = control.get("password").value; // get password from our password form control
    const confirmPassword: string = control.get("confirmPassword").value; // get password from our confirmPassword form control
    // compare is the password math
    if (password !== confirmPassword) {
      // if they don't match, set an error in our confirmPassword form control
      // control.get("password").setErrors({ NoPassswordMatch: true });
      control.get("confirmPassword").setErrors({ NoPassswordMatch: true });
    }
  }

  ageLimitValidator(minAge: number, maxAge: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      // if control value is not null and is a number
      if (control.value !== null) {
        // return null  if it's in between the minAge and maxAge and is A valid Number
        return isNaN(control.value) || // checks if its a valid number
        control.value < minAge || // checks if its below the minimum age
          control.value > maxAge // checks if its above the maximum age
          ? { ageLimit: true } // return this incase of error
          : null; // there was not error
      }
      return null;
    };
  }

  save(): void {
    console.log(this.contactForm);
  }
  revert(): void {
    this.contactForm.reset();
  }
}

class ContactRequest {
  personalData: PersonalData;
  requestType: any = "";
  text: string = "";
}

class Password {
  password: string = "";
  confirmPassword: string = "";
}

class PersonalData {
  email: string = "";
  mobile: string = "";
  country: string = "";
  age: number = 0;
  passwordG: Password;

  constructor(email: string) {
    this.email = email;
  }
}
