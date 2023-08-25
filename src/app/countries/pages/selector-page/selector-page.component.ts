import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from 'src/app/countries/services/countries.service';
import { Region, SmallCountry } from '../../interfaces/country.interface';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {
    constructor(private fb:FormBuilder,
                private CountriesService:CountriesService){}
  ngOnInit(): void {
    this.onRegionChange()
  }
  public countries:SmallCountry[]=[]
    public myForm:FormGroup=this.fb.group({
      region:['',[Validators.required]],
      country:['',[Validators.required]],
      borders:['',[Validators.required]],
    })
    get regions():Region[]{
        return this.CountriesService.regions
    }
    onRegionChange():void {
      console.log(this.myForm.get('region'))
    this.myForm.get('region')!.valueChanges
    .pipe(
      tap(()=>this.myForm.get('country')!.setValue('')),
      switchMap(region=>this.CountriesService.getCountriesByRegion(region))
    )
    .subscribe(region=>{
      this.countries=region;
    })
    }
}


