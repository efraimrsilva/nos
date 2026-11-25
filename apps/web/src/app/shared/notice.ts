import { Component, effect, ElementRef, inject, Injectable, signal, viewChild } from '@angular/core';

const exitDuration = 180;
type NoticeItem = {id:number; text:string; leaving:boolean};

@Injectable({providedIn:'root'})
export class Notice {
  private readonly current = signal<NoticeItem[]>([]);
  private nextId = 0;
  readonly messages = this.current.asReadonly();

  show(text:string) {
    const id = ++this.nextId;
    this.current.update(items => [...items,{id,text,leaving:false}]);
    const remove = () => this.current.update(items => items.filter(item => item.id !== id));
    setTimeout(() => {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
        remove();
        return;
      }
      this.current.update(items => items.map(item => item.id === id ? {...item,leaving:true} : item));
      setTimeout(remove,exitDuration);
    },5000);
  }
}

@Component({
  selector:'app-notice',
  template:`
    <div #panel popover="manual" class="app-notices" role="log" aria-label="Avisos" [style.--notice-exit]="exitDuration + 'ms'">
      @for (message of notice.messages(); track message.id) {
        <p class="app-notice" [class.leaving]="message.leaving">{{ message.text }}</p>
      }
    </div>
  `,
  styles:`
    .app-notices {
      position:fixed; inset:max(.75rem,env(safe-area-inset-top)) .75rem auto;
      width:max-content; max-width:min(35rem,calc(100% - 1.5rem)); margin:0 auto; padding:0;
      border:0; background:transparent; overflow:visible; pointer-events:none;
    }
    .app-notices:popover-open { display:grid; gap:.5rem; justify-items:center; }
    .app-notice {
      padding:.75rem 1rem;
      border:1px solid var(--line); border-inline-start:4px solid var(--leaf); border-radius:.6rem;
      color:var(--ink); background:var(--surface); box-shadow:0 6px 24px #17232e2b;
      overflow-wrap:anywhere;
    }
    @media (prefers-reduced-motion:no-preference) {
      .app-notice { animation:notice-enter .22s ease-out both; }
      .app-notice.leaving { animation:notice-leave var(--notice-exit) ease-in both; }
      @keyframes notice-enter { from { opacity:0; transform:translateY(-.65rem); } to { opacity:1; transform:none; } }
      @keyframes notice-leave { from { opacity:1; transform:none; } to { opacity:0; transform:translateY(-.5rem); } }
    }
  `,
})
export class NoticeView {
  protected readonly notice = inject(Notice);
  protected readonly exitDuration = exitDuration;
  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');

  constructor() {
    effect(() => {
      const hasMessages = this.notice.messages().length > 0;
      const panel = this.panel()?.nativeElement;
      if (!panel) return;
      // A camada superior mantém o aviso visível mesmo sobre um diálogo nativo aberto.
      if (hasMessages) panel.showPopover();
      else panel.hidePopover();
    });
  }
}
