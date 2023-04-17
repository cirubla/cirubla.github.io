(function(){
  var comments = atob('H4sICB7RPGQAAzM2NDczNDg1OTcwMzMwNzIyMDMuanNvbgDsXHtTG8eW/yoUdqV261rSPPWg1pu1Hb+2NndzY2fjm9h1S0gD6BokShKxnVSqhodAiIfABoxBmEfAYAMStsHore9iT/eM/vJX2HNmhBBGPBKTtZKFmkw8092nT59zus+vT5/RT/U/SP6Ax+etb6hnzUz9uXrJ6/K5Pd5mePHNzSsmO7xqkiR3fcNP9ffbWr0BeN8SDLY3WCz37t0z3+PNPn+zhWMY0XIh6GuD2nqts752yXtDcvpdLbsNnA6zy9dmMVkC7ZLLgjUCeg0La2Yt5ZbN7t0WAVeL1OYMmJt9vuZWSW9tdAa1m91npaAT+fzWcrv+0uUvr9645vtR8rTbrrddcNy6f8V59fI35tv1UNWjs382CHWhRUNjq6+5WfIjuXOsw+HQX5hEjhdFB8OKAsuJHGflbA5zuy8Q5K2CjRfsosPG8Dxj4ziGN2PTNskbDNT/fK6+o93tDEq7XXAMx5sY3sTZbrJMA8M0cA6zYOf+wtjhARsEPcFWqVz9UolUnc9bp2Yn1JWB4lSUdr9Wp3rI0BSJLzTU0f5VdfrVWzmmLuaV7BTZXoJaZP3ZW3nme/7O++wUHcuQvgztH6Cvx5XUwDt5hE7kSGSO5F6SR0Pv5FHsttXjvVvf8P1P9X6p9RgiPqOrHbh90A7M1jvb21s9LmcQbMXiBE3/BbQFpS1+qalELADU2v2+Zr+zzRRsgc7MKNdAuy+oU0VyAcuO4CxuqcnZ0RoExnYYCkitTb+2P7TBCnWWOqmiSksVNe5j5nNna/D8PwM+72ftHY2tnkCL5Da1Oe+fr9AoIzawbIPImB1W9rvPoNDklwLQNHBeZJjP/BJOJ+l80N8hfebzuyV/44PzZVqf/XCeqxgvdCb5vWA6u4MOSveDlpbgr5QsaMthgQkY8Lk8zlaT5G32eCXJD5PYxJs83qbWDpjUklmnu9t9S0fj3l6wk47GQEcjlDR2NJpBA+Uu6n++c67e2RFs8fl1E/I623YtuNJq9Qnh95TLKtaKSj3BaJo8rZKFZW0Cy4tWwergbXZQlpVjkQSYpKe1TMTr80vtrQ/+o4ICVoIVwNPmbNYZOaZNB1s62hq9SPtc/T2PO4irE2dFOUie5hbsi+fgKeB3wT8tFsHc2L5X1qarN6+3cO3uH7/4+3XL/wRd/otW/y2m/brlQunv4jfNlh++dX9x//I3wl+tLksALM1yE5UGjP+zvbn+ZxRls+SV/GDWfuR9dwm2mRlcg3UBHiA6KNZlctF4hXLYXWvPBn1BZ+vXhkXWg6XuKQwEnf7gda9bul+WLPtBe09Qagt8Jfm/0sWK7WF++B/oOv9gwf3mwpc3rt017Sy437b8540rdwMnsOCa7KKNFxmBtTOsIAg8XA5kszyPKlZaljMxNrhucrDM8g2Mw2wTK1ba/UvzEQ3A5s9Kbk+wwuGdhXcHOT2bBQvPHZP43nVfjQ2Q+CAd31SSL9TXGRJ+/D47qMZmSaFbyT2nsSFY/ZVkBl6S6AsSTdDumPFGKzyhc9vgHpR0mvZDtU06maDhURKa0p51koeD2sYIOo9ESns5/07uMi4y1o88uHzeIKgUuSitOaXl5hPy9IFjQvl/Wj9gqWKBn+9dvD+9szoGk5/Cw3weaPHdK2Ga8ywvsFYrrOwOmAhnXNUmdnla1B/qYy54fd4Hbb6OwP+1d2D3eAf9yfAOO2LztDWzurTwP50avLE0tjpBiM2eps9dTujvvGBz8Farg5N4t5O1ilbJzrgcLBiAKDk5UXQbbiHY4j/r8Zr08ZiCvt01CAoqvbS/VV+BAg+87h2zgxqS020xQPzvgx3O1Rtkf8OSXsWgUZC+Dr9LOhglHDxBkOjuTKhOfZ/FG0YBjxL4QPdXfvB7/uCDClur3+kc3eClVmcgAGR+cIIMoKzd4zbxok1kbYyN1yfZB43cnkB7q/PBTU+bVNEMvQJJbdpoLGyjj5fqSq4BHMIdpLHPqV79+ta9H5se7DrVk9nFmHgbaxftPM/BEBiBg38JhztVlrnJOBo4e4MgmDm77WinemCDk3CqBxLf61Rv/ncdXXkEDum2t9jVAz6IrI9pcidZXCXrIzQm01g/uDN1dkntzGrPBurqtLVp9fkbMjIN5UohTvLbaleahMLQXn6ipKeJPKDNP9IWVo0qZD1JhjNKupfID4G61p1Tn2RpNE6Wckoupo6t3PaCW9RG1sxm89HutsztvzX66yz//nEcl2j8Jq6NtgbnSlLGhhtRcOXlhudIfpA+jSnJITL3QltZB6RvtKGJaZpfpDMvsWjjJXr9RyG6FoHuyVBG7Zkvdj4CFsnktFFf3RoBOiCdOuiHzG3Sreckslp6UJ+n68hQN0wXLTujhgbryOKCUVKbMKHKnKo9mHA0kzUBE+x23sYBe7YzrmpL1TFhQvGXHrhOMcIpRviDYgSWQZBguLqDQAJz/eLfbrl+lC7tgIS/fnv1MnMSIAEKWNFmtXGMwLA8Z+Ud1kNAAl72myzbwHMNPGN22JkjQMJhDT4aJBxG/LfuvE9yx1ybLqyKxmvPhR3NZA24MFGEba0oMmB4Z1zVJtLpTvfUi/0/8GIsh27Mjm7MWIwP3OsKsNd1iU03dtzYlRuXTyaAbBUF3moDO+etDJigzcqJB7ox3sRYTayIR3W8vrt0cOKhbuzwBh/pxg4nvteN1dXVvZVjdSS2QvJhsjhl3HEfNjKoTvUUF3rJ7Oz7bJgmxsizLjw6TC++kzu1Qu7LL2l4Av5/9So8m/W/99n+t/LMbW9dXSmg250DSnAnvUN0Zgl2YeDglPzAsfa1vwNnxu7xKO5grwueFrfMXani1FhxZpOOjKmPH0KntGdWW+5/J3fR7ZcktEQHJ+jwpJIcoLkY0IH3Oz2wZioPK6kw7X9OFpe1vhdk+yW0N7gksbDex+xObc5Mu0NAe+cZ/q6b9wzkHHk+RZYzxcfx4sKkks0qqWF1Lavmnqszsp2BYToY5Dk8qq4MkXwcaJFoChiDl0ZtI4AOoivme0i2i8rLauYRGQnjRn1rG2Px+XBxCrjrrRgF8gGMPMmpPW+UQhplPxGjawuAV9SxLW25FwcTHdAiXep0HLvK9cLe3ehQyc1h/dBr+nqlaEh6fhBoK4V52pkA8ZPICh1eKcqdoGGoXJxZIP1DH3Z+3Qw6p+MbSjqtFSYxsJF/rBX6lOQY3EGg0CmQJRtJbWtD6+rXwmuonMlhuNTZpWLnI+RhKYfj0+MK8Eh7CrQnSsdSJDppKKaiUxqTycgwajf9jA4vaPECCNEwFzx5KHRr2wky3KuuoGQxTqFrGYRI15fwCo8UxwsGX7RrhUTDyPKzLiU3rhXCZGT0+k0SWiPRZHF1Uo3PQ0XouzYxXZXlr/Yw3dFM1gCms7EI3TgBVuEzrmpe5RTTnWK6Pzmm4wHTWRHSiTqk04HJAZDui7uXr/2Nb/7H7wDpWLvdIbAsYxUYKBasgpEnchSkE4FdzmwVjg3pqjQ4OUhXhfheSAcoQEnN0tgsyYf2JIPVAUah05taYdpwWNpGGK8CBvvRYSXG1dXZUuvJhIMBTwjuCVw7OGZ0tIYDDoVpJEJGetTlITIzSuZXlSQ8LkPN297bXmgOCAm8NDZ41nkspPfJGDa8fukMYi/jZKMXwIGWXsV0hMw2kbMkOgEOXMnOFeWHauYJCa8CKIHKxZgM9YtyF8k9QoywNEpjaUBkdCJFX48j8hh5RsJPkJORbhKZRiQUXwFQoic6DADy+4CT0jkK4N7kBODEd3KkhCDizw2Minl76SgZnTRAjDq2oj7JI2AZiambCzQi01hC2+qhE0+wi9Qc7U4A2HwnDxiwFuVnYJaZeS3Ro8XTHzDwTh6kS9lSikYmrcXjyDPIJNoFiNEYeJnyh2IEAKUPDYZPslEDdaFIdaRFoyNkqK8Mhw1W6cYmSb3GiNd6PwBBfK+/AYwEcBTb5vMkvFHqNz9PQ+PlOoiP5RBoDSpoIPMZBF9ksp8sTSDzehPoDvFrdgrGjsjv8RzcYSya3G10p63IACI1WYeSkRXMKXkZoY/fgNjp0xgJvVEyE0AHrAxEDSzB/aruOPUUllF1eKMk+fEw1If9yEWnx91hwM5i1y8o7CxuXwxGdIMaBihJ0uPFPuCxjw4tAJolw5kPZKlOJ0kUDdlgBLqlk3lA7iQyU5zMlGVcHigevQHShr6mAXsjXNe3FQUYGY0AXH8G9I0cG6MmEIci2BPAWItPhpTcMAzOGBnsFf7rO0NPaIgG+UK3klxH9nNDai6uZ98M1SZ4rbLQ1x54PZrJGgGvgpWHG4DXav6zEryWGYe77h5rdHdwCMi+1tHsq5Z+Wo29nfxTRmA43srBH8uIVuDSbrP/UTA6azX5fR0IBiuQeqPTwTrdguTieZFvdLEuTuDtottlczqttiZn0ylS/yMgdVawszBZBcH+cVBdZA6C6heYC198fcv3j6ZLu1D9yt17J5JpxNlFgRHhvcgzsP44joy+Om6yfAPnaOAFsyAIx4DqBzU4Eah+EPG9UL04/0bb2qYzS++zndrWUwPewb+PxsyHtaw9f1xFm7Xnj49msib8sZV12GxgU8IZV7VJ8ifzx6dBr1NX+uld6UcGvRy6J9X9wYHpOH+/eOOaILpuVHpS+4l8CMOIdk5kHYzVAesDDwuG/TieVOQaeIeZ4RzH9aRVGpycJ61CfF/OrkCXsnjGlhsl0YHbXqWQxkhH8oUmd5aTakg0rC2s0sEJ0pfGM790b13Dv2LcioReK+nht3Ks8ptHEpnGwyn9yJHE0mQkjNGCwgjsxN/KM+XoCFlcVrJPSE/huPm6ezg19vrH53ZPkOgkuCahMBnO4JlebACDTTtE3skDGC2IrSmpZ+XIBFIupI3PSulEn5Jcx3O/5BBdxyRbujZPh1e0oRGt0Le/rZKaJdGEklki4Y3vYS07v7NOuXxuqXJZbt+7clnuee56LBd9vruBO0bnIDl1evJ7CxC5oyQHtFyOri9WdmXctcQmdGUcVZYPKbW+F0pmmMb6MZU5niPJZ0oyAgRxHIU02X6lZqKlE+fUJoys4rCz9wP6Sm4OI1rhDegIlfArzx3LJ9IkkQI10kQUD6DT6WJ3DtlLLsJjcSqvdqXeZ6eMmiyecMcXtUSvQcJ4y2G4sYJwafRoT4t4iD3zlCSTQIl0TgGzGGlbwwxtKFLyM8UZPeQ2maBds1ReLpWmBz8sTYTAJvYbH8gM1axHBLVOMIUpdWyWvimdkpY4kTtJ/CkIyZCxYej4kVdiTMt3q/0pGo/guW2/DMZR0jAoYbhXP0HeBmGUwnV6ILasBE2G7sZKwa6KVgbB3bjZdFIpzCuZATUzVFnNOPQm8RSdfESnNouxV1p6VcnkjMixltjWNkLa8i+75mucbhfSGGELgzms7p7rZ6LFF4PlZARQF0yksokfxxOzFkZ3tneMWC8Nj+CgspPqsoyTLSuT6CjG4EZLVq9Hc/txCMlBGpsGCyrPZxRXMk4iz2v2bLmKS6q97cDRTNbGdoBjWRgf5zjjqubp/2TbgaO+Ej8sTFfTn4nvMP87fCxe2onwVpfgcjk5h+CURIbhxCbWxfIOJ+jO5m463Yn8MXYiLE5xDu7Wj9uKiAenVDLXL3x9zeeQTn4rwgtWWKwEwS7wrN3BiIzddqytCGybRDO0PfZWZH+DE9yK7Ce+byuCpwh1l1qcuLEYGQTYB0gR4I+eGDZ12wtY8UQOl8HB6/mWx9p0lHkqobd9fBnvT5Y3g2ZtopAq1lh7KORoJmsFhYiCCLyecVWb5Kco5BSFnKKQUxSyD4UcHBC9e/3CjWtMOSB66+vvnJcv+04EhVitHGO1CnYbTH0ba4OJeCAKEUyMXf/FLkYP3jrM/BEB0cMbfCQKOZz4XhSiJPtIuBc/WNhY2E1g18MWesRuoDizgDlviU248Ed29BiUkVtXGU0spxkhHkjKUKp1jsG6h0RSs2r8MUKCUiwwT/rmyt9QkM4pDGfOL5FQqOG2F9oeKzxaW3yXIj9JGXCNkn5Iu+fI8Kw60mskQmHMbwAw0YypKMta/DkAHj0faydYZyapAn09TdJjeuLYsJLaUJIxbanwfeMd/BpjaKL0aGm8Qx9jZpgWXwHQpRUm4Q59lMJ75uKrTq0QIqGwOjYL5KGETOeMmBuVlzHLCz9FyBhfZ2gb3UCcRiYNJjGctb6mh5XmjBAcCIu81Ie6+IJOYaC5OJ8hsRV4jwlpWbmUZvhCj0EvLpP4G/wBhbj+8U2oU4snjQ8XlFyvEWHTv/XIkOwcHeilw/1AvDivJ81l1jD8ObNksITph3oQFLoA4kY89a08Btc7OUIfz5FfNnRt4ejeyQPIRmpGSYPW8eccSrpID4IuivIUfgCi/5KhFl9EMDuzVKn+UuXMMOkfAu1Cc5Ru17y6tKL2T5Nkl9q9TnNxDEZHI1CHxrcwC+7xJk2Mqf0pkuwsVdAD3JhjCmMJvSHxp0VMnMMoNn61G97QA8lpkg/r0d+8bqzPQd2lhNMXD5XcI60wrc0PgrUU5TkSKRhReD16OUQW0ZzwcxxMhxzXtno0OQRdqNOv1Om4tj0LbfW0TVnNhNXMI0xIjL7AvNjJhLY1hpmP0HX3SsO/lHIG1/vhKn0LNBijXSsoIT3jU1f+VOVY9VjsJIZLQSe9MIN6MWCc6MPEw9DrcpC/wqCPHdNkBYxptnkCmFvkDwSdXvw9UJOz0dcRNLU57+JDm88rPTCinkoyTcaXqLxEIjDiURChkZyobelGF94oPnxpWApMWzoQK/aNgsUpqX6Qlv5hzhwZjRiR0Z05c3xWeQvLWZp9rW6TvyPQYvohYGr0BF0+ACBN+FOMpbjs9NPifJ4M95LoKzwwgE7B1raf0u1JYAaMZZe9sgXNFvBXNqux97/tXd1qE0EUfhVfoOnM2dnZiZcqeOVF/YF6ISIWEQp60QtFKFgKJiVojfiHVmNbk8ZKaO2FmmD6NJlNcuUreM6ZmLY2yaZNIVvZEAKbZIfZ2ZnznW/OOd82fi51Z3H4YdGWF/bm77Ncd6N9b1E6S8h3yoUciKfxPnqYex++2sZ/0q2vbYTrOGeLvCeN7wxSsvAjlyNxcip1LPvVFuuOnrnYTbOEa/oLGVW2kNg4zoT9w0eohO7xzP3bPGQdAz5JHpMSMAmAXq1Rwr/pCfwi0Kk5HrLw9bZby7aYCVezZ+2TF2hTbb6Mpoom/VK1+bl2prWVbW++AYGG342Qq6yiiAl+VguN3Q2qDVvGw082U8OuOUk4ukS+Ypv9bmulRjXnLt3m137/KhyMk7U331ESceV5TJnoYY8khkw0spPjZ6KUlxoIX6U92g/v5egltVZJ2smpoVnHSztR6OwYZFnAUnEdrtAngXPWXLoybbrl89Pn/JPSX/WkZ7QHxpM+LkqTVkHfBE4QEwImpLoqNSvWmJQcXD4fccJoLCui8X9Z1lNbeUslEoza5C/XWcXMcZDKEHKpQzURQ8w6fH9jiFmRnRw/ZvlGam3wJak+uNeyGRKzbs3N3Hn08O6RqxeEliSw6oNvQAWgdQCnBfWS6oX/FvukMujFBQrEUcAPBIIfa8co3mLUAyTQLsxePz9178G+pz1cnrp47WTExwMIjDJSUYJ2mmC8b6ATJIcWDT0UgBTbvBSYgeLjESeMCH6DGz8Ifq3SAlW1rpTJ6Wj9KLQf73S4b3Wd0siWd/G39mK9tbNqtyjvrvnyGyXd5deG2gkcufn4gWaPeRE/0Izu5PhBU4OX1ohaiJQkCd5jucU45NiXSSeENAHlWIPysQgpyL9hP9Zzc8jiMPnG/Pwf/EIfuD1qAAA=');

  var input = new Uint8Array(comments.length);
  for (var i = 0; i < comments.length; i++) { input[i] = comments.charCodeAt(i);}
  var output = pako.inflate(input);
  window.g_commentLoader.onLoad(JSON.parse(new TextDecoder("utf-8").decode(output)));
})();