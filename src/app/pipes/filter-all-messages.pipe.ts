import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  transform(messages: any[], search: string): any[] {
    if (!search) {
      return messages;
    }

    search = search.toLowerCase();

    return messages.filter(message => {
      return message.messageText.toLowerCase().includes(search);
    });
  }
}