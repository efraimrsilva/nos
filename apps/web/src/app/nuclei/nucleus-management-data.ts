import { Injectable, inject } from '@angular/core';
import { NucleiData } from './nuclei-data';
import { isNucleusId } from './nucleus-model';

export type ManagementScope = { owner: string; id: string };
export type ManagementOperation = 'name' | 'purpose' | 'nominate' | 'accept' | 'decline' | 'demote' | 'remove' | 'leave' | 'close';

@Injectable({providedIn:'root'})
export class NucleusManagementData {
  private readonly nuclei = inject(NucleiData);

  async leaveContext(scope: ManagementScope, signal: AbortSignal) {
    const selected = await this.nuclei.selected(scope.owner,scope.id,signal);
    if (!selected) return null;
    const result = await selected.client.rpc('get_my_privacy_preference').abortSignal(signal);
    if (result.error || typeof result.data !== 'boolean') throw new Error('Não foi possível consultar sua preferência.');
    return {scope,name:selected.nucleus.name,admin:selected.role === 'admin',hidden:result.data};
  }

  async apply(scope: ManagementScope, operation: ManagementOperation, target: string | undefined, value: string) {
    if (!isNucleusId(scope.id) || (target !== undefined && !isNucleusId(target))) return 'Identificador inválido.';
    const base = {target_nucleus:scope.id};
    const calls = {
      name:['update_nucleus_identity',{...base,identity_field:'name',identity_value:value}],
      purpose:['update_nucleus_identity',{...base,identity_field:'purpose',identity_value:value}],
      nominate:['nominate_nucleus_admin',{...base,target_user:target}],
      accept:['respond_nucleus_admin_nomination',{...base,accept_nomination:true}],
      decline:['respond_nucleus_admin_nomination',{...base,accept_nomination:false}],
      demote:['demote_nucleus_admin',{...base,target_user:target}],
      remove:['remove_nucleus_member',{...base,target_user:target}],
      leave:['leave_nucleus',base],
      close:['close_nucleus',{...base,confirmation_name:value}],
    } as const;
    const client = await this.nuclei.clientForAccount(scope.owner,true);
    const [rpc,args] = calls[operation];
    // A operação usa a sessão que abriu o diálogo. A função no banco revalida o vínculo sob trava.
    const result = await client.rpc(rpc,args).retry(false);
    if (operation === 'close' && result.error?.code === '22023') {
      return 'O nome informado não corresponde ao Núcleo. Confira o nome atual e tente novamente.';
    }
    if (result.error) return 'Não foi possível confirmar a ação. Confira a situação do Núcleo antes de tentar novamente.';
    return '';
  }
}
