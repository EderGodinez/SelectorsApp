import { Injectable } from '@angular/core';
import { Country, Region, SmallCountry } from '../interfaces/country.interface';
import { Observable, combineLatest, map, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {
private Url_Base='https://restcountries.com/v3.1'
private _regions:Region[]=[Region.Americas,Region.Oceania,
                           Region.Europa,Region.Asia,Region.Africa];

  constructor(private http:HttpClient) { }
get regions():Region[]{
  return [...this._regions]
}
getCountriesByRegion(region:Region):Observable<SmallCountry[]>{
  if (!region)return of([]);
  const url:string=`${this.Url_Base}/region/${region}?fields=name,cca3,borders`;
  return this.http.get<Country[]>(url)
  .pipe(
    map(countries=>countries.map(country=>({
      name:country.name.common,
      cca3:country.cca3,
      borders:country.borders??[]
    }))),
  )
}
getCountryByAlphaCode(alphacode:string):Observable<SmallCountry>{
    const url=`${this.Url_Base}/alpha/${alphacode}?fields=name,cca3,borders`
      return this.http.get<Country>(url)
      .pipe(
        map(country=>({
          name:country.name.common,
          cca3:country.cca3,
          borders:country.borders??[]
        }))
      )
  }
getCountriesBorders(borders:string[]):Observable<SmallCountry[]>{
  if (!borders||borders.length===0)return of([]);
  const countriesRequests:Observable<SmallCountry>[]=[]
  borders.forEach(code => {
      const request=this.getCountryByAlphaCode(code)
      countriesRequests.push(request)
  });
  return combineLatest(countriesRequests)
}

}
