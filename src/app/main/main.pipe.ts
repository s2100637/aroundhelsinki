import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'mainFilter'
})
export class MainPipe implements PipeTransform{
    transform(array: any, field: any) {
        array.sort((a: any, b: any) => {
            return a - b ;
            // return a[field] < b[field] ? -1 : (a[field] > b[field] ? 1 : 0);
        });
        return array;
      }    
}