import { FormGroup } from '@angular/forms';

// custom validator to check that two fields greater each other
export function BiggerMatch(lessControlName: string, biggerControlName: string) {
    return (formGroup: FormGroup) => {
        const lessControl = formGroup.controls[lessControlName];
        const biggerControl = formGroup.controls[biggerControlName];
        let lessflag = false;
        if (lessControl.value < 1000) {
            lessControl.setErrors({ fromAmountLess: true });
            lessflag = true;
        }
        if (biggerControl.value < 1000) {
            biggerControl.setErrors({ toAmountLess: true });
            lessflag = true;
        }
        if (lessflag) {
            return;
        }
        if (lessControl.value > biggerControl.value) {
            biggerControl.setErrors({ biggerMatch: true });
        } else {
            biggerControl.setErrors(null);
        }
    };
}
