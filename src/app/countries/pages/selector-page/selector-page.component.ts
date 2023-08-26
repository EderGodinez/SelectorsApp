import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from 'src/app/countries/services/countries.service';
import { Region, SmallCountry } from '../../interfaces/country.interface';
import { filter, switchMap, tap } from 'rxjs';

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
    this.onCountryChange()
  }
  public countries:SmallCountry[]=[]
  public countriesBorders:SmallCountry[]=[]
    public myForm:FormGroup=this.fb.group({
      region:['',[Validators.required]],
      country:['',[Validators.required]],
      border:['',[Validators.required]],
    })
    get regions():Region[]{
        return this.CountriesService.regions
    }
    onRegionChange():void {
    this.myForm.get('region')!.valueChanges
    .pipe(
      tap(()=>this.myForm.get('country')!.setValue('')),
      tap(()=>this.countriesBorders=[]),
      switchMap(region=>this.CountriesService.getCountriesByRegion(region))
    )
    .subscribe(region=>{
      this.countries=region;
    })
    }
    onCountryChange():void {
      this.myForm.get('country')!.valueChanges
      .pipe(
        tap(()=>this.myForm.get('border')!.setValue('')),
        filter((value:string)=>value.length>0),
         switchMap(alphaCode=>this.CountriesService.getCountryByAlphaCode(alphaCode)),
         switchMap(country=>this.CountriesService.getCountriesBorders(country.borders))
      )
      .subscribe(countries=>{
         this.countriesBorders=countries;
      })
      }
}


