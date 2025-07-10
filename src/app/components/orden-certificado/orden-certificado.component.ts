import { Component, OnInit } from '@angular/core';
import { OrdenCertificado } from './orden-certificado.model';
import { OrdenCertificadoService } from './orden-certificado.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-orden-certificado',
  templateUrl: './orden-certificado.component.html'
})
export class OrdenCertificadoComponent implements OnInit {

  compania: string = '';
  numeroDoc: number = 1;
  certificados: OrdenCertificado[] = [];
  error: string = '';

  constructor(private certificadoService: OrdenCertificadoService) {}

  ngOnInit(): void {}

  buscar() {
    this.certificadoService.obtenerCertificado(this.compania, this.numeroDoc).subscribe({
      next: data => {
        this.certificados = data;
        this.error = '';
      },
      error: err => {
        this.certificados = [];
        this.error = 'No se encontró el certificado.';
      }
    });
  }

////////////////////////////

exportarPDF() {
  if (!this.certificados.length) {
    alert('Primero realiza una búsqueda.');
    return;
  }

  const data = this.certificados[0]; // Usamos el primer resultado
  const doc = new jsPDF();

  const fechaActual = new Date().toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const logoBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAV4AAABkCAYAAADOvVhlAAAb1ElEQVR42u1dCdhOVdeOylCUFBl+JFKGEJIiafoqlGggkWhOESqVKRqQNIgMpWQoNPiI+sxRGqR5/MuQWVSSvgbT+fb9XGu/13r2s/c5+xm91VrXdV885+yzzx7vvfZaa5/3gCAIDhAIBAJB7iCNIBAIBEK8AoFAIMQrEAgEAiFegUAgEOIVCAQCgRCvQCAQCPEKBAKBQIhXIBAIhHgFAoFAiFcgEAgEQrwCgUAgxCsQCAQCIV6BQCAQ4hUIBAKBEK9AIBAI8QoEAoEQr0AgEAhyQrwiIiIiIpmVaOKdPHnyuquvvnqzQCAQCFIHuNSbePHAAeqWQCAQCFIHuFSIVyAQCP5KxFurVq2gTp06+RbSyQKB4G9HvP/973/zt+XaKO8VV1wRbN++XSAQCHKGww47LLPEC/nj2w+DbRP65SugTDbi7dSpk/hRRUREciqHH3545on3lzemBivblslXQJmEeEVERIR4hXhFRESEeIV4RURERIR4hXhFRESEeNMn3lXtKwSrO1dLgA+BrupQMdg4sHUCVl91rBCviIjIP494ixUr5kW8O5fNsBbGh3y/69rA+uwPU+4T4hUREfnnES8yg/w8Z5yTANd2axTs27M7eO+994JHH300hg8//DBp4p0xY0aMNIGvv/462LN9S7DqygpCvCIiIkK8JnbMnxjs27cvqF27dt5zIN9kiXfAgAF5z3fu3Dl2bevYXmkT7/jx4/MWBB+8+OKLsedef/31WJmi8NRTTwW7du2ydsa3334bdO/ePRJ33XVXZMeuXLkyePjhh4Nrrrkm1j79+/cPli1bFrv3xBNP5OWF/0NQj2TqrT7q4Xz3zz//HDz77LPBzTffHGtfvGf69OnBH3/8kfaA3bNnTzBnzpzg9ttvj+V94403BmPGjAm2bt0abNiwIa6dPv3007znsND7tO3AgQMT3nnTTTflLfImTHn88cedab/66qtYml69ennnx2X58uWx8ql5F3Tp0iUYPHhw8OWXXzrToyytWrVKwJ9//pmXpn379tY0ffr0id2fMmWKV7txvPLKKwll+eWXX2J5Vq1aNcYTmP+oC/pF1x3tEiX9+vWzthvaAvLmm28623bt2rVxeW3atCk2fipUqBAcccQRwSmnnBKMHDkyWLRoUd4zaENTfMfSQw89lD+Id80NtYN9u/4MZs+eHffSdIn34IMPDtavXx/s2rQqWNmubFrEW6lSpaSO+p1xxhmx59DQvs80a9Ys+P333xM6Y/HixV7P63a2yU8//RSrU4ECBazPnnrqqcFxxx2XUH78m0y9cfzaFCyoIPvixYtbnylTpkwwderUlEl3/vz5sYlry7tw4cLB5ZdfHncNuyItWAh86oX+j5okHKgzlwsvvNCZFv0bNcZcC/KZZ57pfObSSy8NtmzZkvAcxoEt/ejRoyPrpseFK48wYC5wwaJYvXp1a9qiRYuGtr0prmP/urxh/fzRRx/l5fPFF18EpUuXtqY79NBD8/6PRcgU37FkmyP7hXi3zxwZu9+4ceOMEi/Qs2fP2PXNw7vke+IFtEaRSeLF4lOtWrWUyp8u8UITxfFrn2fvueeepEkXZFGwYMGkypgL4p03b15eOuxkjjrqqIwS77vvvhv6fg1obSBoH+JFWq315oJ4W7ZsmXLbZ4N4UfcTTjjBq0x/KeINk6VLlyYUMBPEi1UK2t7e33YGu7euS8De33/NKvFiS5/MczirbWq96RAvtvF169ZNepJkinh79OiR1PPjxo3zJt3XXnvNqcHvb+LlExMmkLC8kyXedevWBSVLlvSub5UqVYIdO3ZEEi/XeqOIF1t4c2yUL18+dk0DuygX8cJ/w+9hSz9hwoRY35x88slJE+8FF1wQez9/rlSpUkHbtm3zTGbI58ADD4ybL7gGLRfy/PPPxz1fuXLlmHlk4sSJsTb8yxEvtg0oVBhMbTdTxAvceuutscEdhmSIt127dsF5552XkB42U3OAwn73wgsvxKU95phjYgMMuP766xPe/c4778S9Gx/PwFacp4G2UKNGjbzfGKywY5nywAMPWAn6lltuCYYMGRI0adLEm3jPPvvshEmLdrjzzjutg2rFihUJxIgJBhsebLuw3RUqVChhofz+++8jJxoWFHOiAQ0bNgzuv//+WN4ucuLEu3nz5pg92xjswdFHH533u3nz5gl9AoFt0CTVgw46KPYvtHAQpLaX6nuoPyeiNWvW5C202JmY+Y0dOzaWhsvFF1+cUKdzzjknRhDwRTRo0CDhPhZAXm5oeWXLlk1IV65cueC3336L2cEfeeSRuHsom6k9h2m0pibK72MMuMwceD/39fgQLwTt5Opn2zwGV3Axd2YLFy6MGyfcBGEjXqQx2wzzm49DPPf+++/nhnhTRaaINxWEES80LZOA8F4+aTRx2QYEJ6e9e/fGtnjmADflpZdeiksDZxw3Y8B+unv37rhn8EW4I488Mu65ihUrBt99911cOlub2YgXziozLdrhk08+sdbtkksuSdBAzImLnQ7ssMmaHFAWG7lw2+rGjRvj7NauCQlHCb8Phyi3C8N+7BIQGH/2/PPPjzMboQ+0bRA2/LCJb8vPLCu0M5tiweuNcdCmTZuEBW3btm1euzg97/Buft1cAHyIF1qs7T4WN/4sFg0u0DRRPgBKWS6I19S0zcV22LBheWW67rrrrGUYOnRowm4GZMs/j5uzqIa/E/GCJDCZbMT7ww8/JE28kBNPPDHuvkmMti07NGlzYixZsiTuGfM+39aazi9z0NmIF5qSjXhhx0WsNq/bzp07Y85NnnbSpEnWwQaiNXcEUdK0adO4Z+rVqxdbxEzBLiCKeC+77LK8e9BUEX1hasGrVq3yIl4QiP4/tObnnnsu7ze0oXSJF2TO72NR4NEIWn788cegRIkScWmffvppL+KFsxNaZ7LEi0gA/XlDHamCsqF9QT78/VdeeWXcs7CB4z4iUFKVdIkXuyX+PPwiUHjMBStMuBMV4x9cYWrBYXUU4jWIFzYyDChtK7MRrw6ZQjoQjw/xzpw5M+7eVVddZe0QTozQHCEYEGGOuW7dusXdx/bNJSgzyqmBkBpNoLiHetnaV7cTwoKQDv/a7JrQvF3hchiIZvvbJjk3M5ikDnOVS7Bg8LqZ34YG0eh8TjrppNi1zz77LC7/J5980ot48btmzZp5v/k285tvvkmbeE27KTQslyDcjacF2fn6LTD3kiVe29x1yWOPPRbq54AJC+Y1Mzokm8SLhcNVJsw57OAWLFjgfD/Kyvu7UaNGseswLfC8YA4S4vUk3qiQHNskcg0IFzAxbNrLr7/+GucUwADQwid5/fr1Q0OYbFvBZMVFvLZoA3MLHibHHntsXHrETIbFIpttZ8Zi+oqZFxYrbQLi9libTc9FvPfdd19C+Y4//vjIie9DvKZd9q233nLWDTHVZsigi4QwpnhoGhYj09mUSeLF4ucKAeQ466yz8hb9bBMvbOzmLsEG+HJMsx4EsdM8HXwfOrKHh1LCjCXEm4+I95lnnrE+DyM/Twe7pQ5ohzNEX4cji2+LTK8zCCFXxGs69aLa03QI2SaNyyMO2OKffYSbAvSuQLctJ15MHJvGbiNe28KAgx2ZIF4e36q16LD4Zp4WzlgXCWFRNiOLTMdrJolXxyGbC64NiFjIBfFCsJD5RIzoMFUucITyNIgm0mOJEyryBxkL8eYT4gVxmk4Gmwc4DDhR5IqT1CtwLogXW/Oo8Bsu0AhdHmXbhDXrbTso4CNwkvi2rWlDdxGvzV6on02XeLlZBMBpKZdMmzbNW+PVuyFbdJEv8WJx0s6nsO20acLDicsossOikAvi1U7Za6+9NmGRM6NXEMXABWZC37Hk6jch3iwSrw6PwXYWRBmVz7nnnutdbm4jhreb38NWMlfEa9p4Efrlstchzto8BLF69WpnGaDd6rAtjVdffTWl+vgGzLuiLVzEO3z4cKuGky7xwm7I7+Moq0ugZfO0CGuLIl5E7KRKvDZTFsY4NFbsvvQxdJfdHhr6oEGDghYtWnhpmNkiXi3wV8AH07dv3+C0006LjDn30d41bEfQhXhzRLy2qAYzHx4xoIO6zbPm/FQUNCJNcC+//HKCRu3ammJg8+B321n0ZIgXg5bbpYG5c+d6OVoQ8hYlp59+etwzF110kTUdohF4vQBoNBAehaJDfcy25cdEETnhS7x4h45h7tChg/fEjyJeMwIEJhrbgobFyYxzNonCRrzIy3XgJhXi/eCDD6z3MRb09z1A9qaMGDEiLu/WrVsnTbywUXOBXZabj8z2598lwfcvTDGdb717946L4TUd6OZYKlKkSN59V4icEG8OiZcHmZv58IEL6I9+cDFPx3388cd5EQlmHC863PwojUnQYVt9X+K1BfojPAeRD1ywEJgODT6gXWKaMmwTDY5KHPpwRXaYESWw95rCD8qASPF9AR/ihSBuF9ew5c8U8eJgg1lvLFym3HbbbXFpMOnNstuIF2Ie1kmHeB988EHrfT5/EKFijjfE0PK8EZKWLPHCtMJP7Jkmu3vvvTfuee4TwS7FjDlHOCR/Htq5FhwI4vds3x7R4wGAUmLOBSHeEEJBY+Ed5tlwdJqLfNMhXjO433Y6jceOmiFGGFxm3aDRgKQQ04vtqLltN22BnHRNhx3Kjus25xa+J2Dz7mOQIlwLzgiE6ZinHHUoW5ggztT08MNcAfMKQn6gvZh2VkB/NQ5yxx13RJo3sNDxNPzrayBBk6TwW5MvDgHAtg2vPPI2T4vdcMMNsWs69BAkYTq48D5zgto+uIOTiNDSMD5wsjLsOwlYzEHovO3hD8A1OGdhHrAdPEmFeDnZuIhX9zu0XLQFTvyZcdo2hcMU2PnNMkPxgOmCn/J0LbTm2EYcNsYqFnD0temH4Iui+U0WvasKU1qg8AjxehJvlKMsqrH1ase3Gpx4QcoYKNoEYR6phQMD8Zla4Hnm22GtQWh7HggRW2jfeh9yyCHOTwqGPWdbvW2xxFEYNWqUt3121qxZSeWN01x8gJsLDq7xT2vC5IH2ML92pts/7FsNpvDTS+l+qwFj0CfsiR9I4f0T9q0GXRY4x8KIF0eyzfJy55oGt92HEW8YMF/C4rrD4pxdANGbByOS+S4JzHtY/MPGEl8sMJZMZx3GkvkpVyHeLBKvqfWa2rP+2I1rIvKyub7KxKMIEJ8I23BUnTEQ+Fe1MkG80BZs3xawIZWoC/OEmQtwLPKDEz5f0HIRq27//UW8EERJ4KBBVL2hYZsLqQ/xot/Mo+yc/NL9Ohl/3lQu0hkX0PjNwzU22Bx9nHhNIjXBD+y40vDdq2usmLsEId6/EfFqRxK+1OQqN05sadtwJolXOwhh63OF50B7sNlXfQXfcYZGYcsbkxDmFNOu/VcnXh2wb/O2c/OB7XiqD/HanJ7ZIl58rAnzhDuRtU0dH813xby6BCYA7kQzNV3XKUROvIipxwduTBLHImGaPYR4c0C8sMOF/QUGU/DBlai/aAA7Hs9DDwzXXyTAB3K0uL6874pKwGTF17tgioAtEI4snBLzOZoZVm+fvyIB8sfHbeAMhBaMLTscFjiZl65AQ4NNFTZemBQQhwmtxnUu3vXXCHgctOsvTOj2z/RfoEBMse2vPkTFQEPLu/vuu2MnotCnsOtzJ58pYX89gjuUsJXmfyWFL648KsEXb7zxRhw56nz1x2gwt+CIxNxAmJxul1QE36rAWOPvx3gI8x9Ai9Vl0u9GenzoB9dgfrE97+pXbgN2jRU+3vYb8WKwcGgvbDp/7DJKU0s1qkFEREQk07JfiDcWcL1TfdlozedxWN2pSiTxrrm2euyvSXDs2rxaiFdERESIN4p4o/4EfDJw/VkfIV4REREhXiFeERERESFeIV4REREhXiFeERERIV4hXhEREZG/BfHu270r2PvrjowAeQnxioiICPGGQP/J80wjlbJUqVLFGRgtEAgE2YB5Um6/nFwTCASCfzKEeAUCgUCIVyAQCIR484gXH9fABzUEAoFAkDr0N399iPdegUAgEGQU4cQrIiIiIpJZEeIVERERSUNKlSxRTaGFEK+IiIhIbkj3EIXFCksUSgvxioiIiGSfeB9UeE6hWM40XvWyygo9PHACpW+q0CYiz3MVWqfQAFcotI9I08J3S6DSXafLHZKmq0Jzj3LxtrhVoYNCFc9yFFPorDBYYZTCvQrnJ9k2LTz66BhKe5jCHQqHh+RXWOF2pI147ymof4oDGs/2USgQke4ghbYKQxQeVrhboXES7zDboadCF4X6jvHeNSLPEzB2jHEU1fZtLPkcqNDXVg5L2gaUdpjC/QodFQp5PId+7GWU5SbMP4XiIc+18ahTOUpbDm2aBrHZ+kiXsYglfc+IcvG+aero/2sU6jr6Nqr/6/B3ZIt46ytMYZimsIv+5debUvr++B2RJwbPhCQ7p6TCGoW1CkeFpBsDeOa5AhM65H49he0K7ykUDEk3S2Epa4uXFN5S2Eb3Tgt5tp3C1wrvKjyucJ/CRIUNCq8rHO9ZlzFUnykhqE9pj1EIFJ53kZ66XkJhiybrkPdiIM9KccK9ovC7wmUhaY5WWKDwucKTRLyvUNu+5Fm+lUY7TFWYp7BZ4d8K/8fSN1f4/4g8sQisYL9HGPl/qfCOce0uSz6dFP5EP0S8b4DCRuov1P9pesdnCpdHPIt+/MWYr68qfKKwSWEk5pbluSke46k6pT0deaVBvLY+Qhm/UvjGXNip3HNCyjWCpe1PbWVy2Hwa3xhDZY2+jer/a3n/58TUQJN2p2vAZ5F4+yn8hybhgBwR7ziFZ9AR0DAiiLeH5fpxNEk2OzSejnSvm0ns6ndFhRk0aI71JN5hSfThj0T4/fYH8apnGtHiMhoLTEi6J4gkixnXa9KkqZtq+dT18jSBZ6ZDvA7S6u/RBguJ+L5XOMmRpindP9O4XoQW6T4exJswX7HgKlxACsNytIWlDr7jKRPEO8ux08Hu5ge+wyHibe6Zt5OP1PVKCnMVpgvx2tMXIQLClv5qIsKi2SRemAlIy2hAW/8FyRIvu48Jsh4dza6VJeLpGvJcISKdF7NAvFvI5LPJsShkm3gnkAZbntr5XEe6t7HtzPSkZvdr03iumEviVfcvVFiF7b7CZNeYVdd7hy1MHvUvETFfDyVlZkZ+I152f7rCo5kmXrp/msLPWusX4o1P3422bgVpFVzhIroMEi+2dNPo/2WIJFumSLwo95sKQ412etPDvnkWtXfNTBMv/b87mXBq5Yp4yY4Gsj2Rfj+p29qSdg6fdFmY1KWofevkmHixmxlM/29GbV3Zku5G2nIfmg3iZebEHVyrzmfEC9v+pCwRL3aWvylUEOJNJC3YWG9h1+AseB8knA3ihQ2ZbMnnsWuPm1qBL/FSGjiRFrPfsGEN8iznRwo3Z4N4mUllGXe2ZJl4R/AxQlrnVoezq73CTwpj0R+2Pk9zUvcnW+mBuSJebJtpIee25dm2/lPXjlD4gHwG1yQTzuRLvMzs0S+fEi98HQ9miXjvIx4oIMSbaAf9ins3aXsGY3znLBEvnBnzjWvVyaHTOEXiRT2+YL/hTLvRs5zQ+vp6EO8WMsPY0DWEeIvQxJvMBmBWiJc84CCds4zrcBw95XjmAnKCbaPt+fPk9S7qOakXE6FyIOpkvMI6hYtzaeMl5+lo49plVJaSjjYbQea27WQaGKRQI4PE+yzs6UYdfMdTtmy8JcnG/x0OMBjEu9pRrm+12Yjx0RxL/3ekEDFTwfpLE+80D+Id7/m+BbZBrK49oLAo08SLyUxOpw6W9JPQWSkSL4jiXfYbZHCHZzmRtpcH8WIgtXTgGBfx0rWq5EG+J8vEi1CoOZbr55DWWzXk2eJk53+U+ugdbjcPKd9W6muN78jUcb/5PpqUK7NFvCBLatfaxvUCtOvoH7H7a0K7p7nkdLs6Q8T7oqFVTkliPGWCeNfSPNJYTH200IwKIuLtF1K2IgYfbTb6fz1hoOm49iRehA8uz2/Ei9jPeR4kMcLjXS0p3GaiJlQGDIw9Cq0yTLw9SKsYa3nnq2QLq5EC8T7DSRvaHcKaPMp4BHl1/5UtUwO7fj4N6lbZIF4izlUUyjPGAmjCD3vmdTgWXtiHky0fxWHiXb0t6ZtRexcNyfN6bP1TJN5RtFuz1X8JabVFPdugLxFW0TRtvIWpXzrtR1PD26RJalzlim9O19Sgfp9MedzmmAPrw0xaFKc/P78R70U0YY9w3Ncr+y0e74ID4mVqPBtm8lCgdImXHHfvE0m63rmEb8l8iFfda0jb5AvZtVZE8KdElHEQmSUKZpt46V5P2sY1ygLx9qY2d7XtEzToS3vmd6dNe/bcxnagPrnAuH4IaUitQ/IcFbZjcxEvi+AYGtIGMKt196x/aYqDrpEm8SJq5wsespefbLyZJl6mtWLH0My4fiT5FP4Vkud401SUH4hXRx08FmIfgS2rVMR7GtPErxKSphZpJ00yRLydTXuy5Zk2NDHL+xAvDUoM6rGWe9MohrJqyJb2e1OrzybxsoH1Nr07I8RLoXGfhNm1aSu9TMdp4/AILa61HOknRJmsIuJ4h5PJopJld7LAcWrqJJr4LVMgXpxMnB1R3j40JrSzb5wrnA62aRqLxVMhXlKCetA8u9xSh78t8dK90eRYLWep+xzbyUAKP9ti+ij2O/FSmrNpKzeRNLvKtIUbSo3W0eM9sC897ZFushFqMoYcMW0dOD2EeBeFHc5ggxVB5w8YxDuavaMDhWlNI/J6ROFgh/NgFmmYGCCnUvteRKaITb4xrFTvqSH1bstCZqKIV38UJPAk3qUh7zyf0t1Ag7xQRH5ddZw2kcYkIpfhFPtak6IbRtMC3iAN4j2YPOb/4f1Dzqzl1AYdKfytHkXTwA7+SMQ7E4iXTCOrPU6alaR6dWLttoEWoC60TW5I42s1H4cRxHsT65NO5EBeSiaGdo46RI2nMox4t4aka2cb/2kS78CQ97XxJN7CZEOeqRc6ul6JIokQQ38lKQBo97uozQf7lDPTxFuOttvlItLVIc3pU5o40CxeMFV7x7OlSONo6JG2GTXe0fR7AE0YF4awZ19gxNCI8int8c6OZAY5iH6PNN6xiI61wnlTLyKvgjS5ZlOnbibNcEzUs0Y+UfVezOqKPlwYkV81ao+ofu4U8c7xTIu+1aMehUnbaGfY+rGIf0wk9DkRcgOP/FC+kSH3KxHxdreMwaEUyriBYp1fs0XSWPJ8yAz/o4M/06NMRsx2O9oo4xCad6vJOTiPxk1UHHhx6kfeJ/OIWEF4JULqEDWemlDauhHpFkZo5aF9ZEk/N+J9/2Zpb0ZdIsb5fHMnRgechpHpcSO1+xyb0z1l4hUIBAJBdiGNIBAIBEK8AoFAIMQrEAgEAiFegUAgEOIVCAQCgRCvQCAQCPEKBAKBQIhXIBAIhHgFAoFAiFcgEAgEQrwCgUAgxCsQCAQCIV6BQCAQ4hUIBAKBEK9AIBAI8QoEAoEQr0AgEAgyjv8BssBzWnazzRkAAAAASUVORK5CYII='; // ← Pega aquí tu imagen Base64 completa

  doc.addImage(logoBase64, 'PNG', 15, 10, 60, 20); // (imgData, type, x, y, width, height)

  doc.setFontSize(12);
  doc.text(`Lima, ${fechaActual}`, 140, 30);

  /*doc.setFontSize(14);
  doc.text("CERTIFICADO DE MANTENIMIENTO", 15, 40);*/

  const pageWidth = doc.internal.pageSize.getWidth();
  const title = "CERTIFICADO DE MANTENIMIENTO";
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  const textWidth = doc.getTextWidth(title);
  const x = (pageWidth - textWidth) / 2;
  doc.text(title, x, 40);

  doc.setFontSize(11);
  doc.text("Para:", 15, 60);
  doc.setFont("bold");

  doc.text(data.nombreCompleto, 30, 66);  // ← Cliente desde DTO
  doc.setFont("normal");
  doc.text("Presente. –", 15, 74);

  doc.text("Por medio del presente certificamos que la unidad cuyos datos le indicamos", 15, 80);
  doc.text("le hemos realizado el servicio de trabajos preventivos en nuestro taller en Lima.", 15, 86);

  autoTable(doc, {
    startY: 92,
    theme: 'plain',
    styles: { fontSize: 11 },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 130 }
    },
    body: [
      ['MARCA', data.descripcionMarca],
      ['MODELO', data.modelo],
      ['COLOR', data.descripcionColor],
      ['SERIE DE CHASIS', data.maquinaCodigo],
      ['PLACA', data.numeroPlaca],
      ['MOTOR', data.numeroMotor],
      ['KILOMETRAJE', data.maquinaKilometraje.toString()],
      ['HORAS', data.maquinaHoraKilometraje]
    ]
  });

  doc.save('certificado_mantenimiento.pdf');
}

}
