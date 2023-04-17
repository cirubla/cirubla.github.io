(function(){
  var comments = atob('H4sICCXRPGQAAzgzNzcyMTA0NTk4MTQ1Mjg0MDMuanNvbgDsnXl3E8eWwL9KH8Hwz7Ok3he9YTIsZkuYiY1NTCbvzGm1WlLHUremu4UxOTlHYLxgG2wHwmbxnAeYOCHYZnkgyzZ8l4e6Jf3FV5hb3ba8aXOsZ/RylOPoSN1Vt27Xcn/3VlUX33kuyrqhaKon4CF8uKfNI6uSFlLUCFzo7jrh5eFSWJZDnsB3nkvxmGrA9ahpJgJ+f19fn6+P8ml6xE/iOOM/YmpxSO2kOqglZPWcLOpSdCODKPgkLe73+o2ELPlRCsNJ4Sd8hL+UMxLayGFIUTkuGr6IpkVispPbLQxSR0IHZVNEen7l/8ZzrP3syXOntMuykuBOx48IPZdOiCfbu33feCCp4qh/0IS0kCMQjGmRiKwjcW2EIAjOBS9DUgwj4ARDEyRDkizJCb6EZpg8xXEkgdOMwBM0Q/I0TvlQ1rismobn+zZPMhESTXmjCBInKS9OeUmui8ADOB4gBR/Nk3/CefiBMpiKGZNLyY+ticI0Fcuv3MnPjRUfTNgDr/IPrlk3HljzjwKYNXg9f3PB/nHEyt62Vn60JqbgZmH+SX5mtrCwYI1nkdSYovZ6Av/znUeXY3XU4AGnVUGZ/gTo4hETiZgiiSZ0Bb8IDfknaAy4G9Xl8JowA6QldC2ii3GvGYXCfKjajIRmOlKROMO/Xi/+kBwWkzETFFtXyJBj4d2Wh7rYptZaK6RMS/nLtNIOZT4TY+bhbw1NPZRIBmOKEZVD3rh46fCmBsOZAEEEaN4nCMzXh+CmV5cNyGocZnD8kC6j0SIfNvWkfEjTQ7Ie7D9cknXo4mFy0/NCYbKuQs/YeGhTvmT6o+YuaxZaS/DD+IqKMc0rh8OyZPocIRtlRZPBrSKRxGTQSAbhTjAZ9EF1l+R5vv9Lm0dMmlFNd/qLKsY3euPmHuh0bl0p3ds07jc3CqgeVmKynyA4mqAYlmYFiuOhZViSQCKg/ymxkhBV0+VErP8/N0lAiWA0K3Ex4ihSZwc2o8l4UEWy2zx9SshEloZkUT3ISiSKyqJI+GXoEnz1+2lfMLG1Yr0nu05HyUTo8vELp/3nTUk/yuo9eOK0/8jaf0e7I/6LX4WOX2rvpv+LlfwGSeL+LtRCoPi3iYjne1SVEVmVdejDOtJ9w5xyPhzZU6cCK1Qd3Hbq5Kh7CdXDht08aGqmGOt0u58nQHBbbhqmqJun1ZB8qVSzxLb8iinHjS9l/UunWlF+GAx6v9PmW43n8V76REcPT4f7XeP51aUzHe14I4ynl+FYnmAJimQojuEIgeDQGPGUBs0mq4kLXpxxBiEfoIkAg/sIituwmjvNbI0M0OcPyiHF3ASvg3CtEsA4P7rZVqfwrTbc8J+UVS0u+086n5Fv1G/Uwsvx3MpK4f19+95CLpPKZX61F24X3g1YmUzh5ytgwO2xFWvofvH2fbDhH1JXkVRJU01oJCR3zWSsWYuypfx7UMf8/+F+/p7SthED1dWnNdD+Mr3ls61W9dNTpA4l/+mm/zMjqvWtOQ6HCZKmKJ4WCBx66AGp3Igr9VdPVeN/MiZKZ45cKGf3y9XjuuHHKZJgOJ7mCIqmGF4gBXbfDT+xxfA7v1zDv668Eo8Qjvbof0caXPEHCdara0mwoyFfRAl/JolQ6uGgKBBiiJYlimKooERIUMM8E5I4UWS5sBh27b4Z1Q8qqtd5Kq+pbRgZuLEZw3rMMTFGvxpa76uQQhZDftfjboAn0OZxZfwOA12my6O605K6JFdmfuUhhIRujJXy0neMCbcfwE8ZtcSXOlBMN/s3dVDPeuEIasdiomGAmItiLInuJZSQV6BpHvo/xTvDcFumkGIkYmJ/lxKXN2VDtWktvWbs9AjJ2XdnMdfSI/v+FyRkGyO7LxztPNUnrAcYDWQkR5IwYEkWZzmKpQWKIutgpBAg4I/xgZz6GFk2Q6MYWVb4Vkba12YKi4/s2ZVcZtSaHLeeP7UnJotDP3xcGbfevswvT9jTr+3nj+si4e5kNR/nyrR483GutpKfgnMcwaDI4oBUbtTUyblaQU412DV1lLOu/D8h1llDI8VKtCSJpECLMoTEJBMmJIISROhhXCjMhFpobDo0EgzqpvDJ7oWNjoWvwMZjOLCxp7dfOreZjR0NiR8hCc1xPE6xOEnhJCvURCOBB0gmwNA+ThDqQmP5DA1CY3nhW9GIJvRuLlo3HuQyyyhUW5iwMnfQ/N/ks+LwVHF4ojiwar0bKT67B0T7RnUTWtnbhYVZCPdOd1mDv1kTGTfss648sEdTdnrBGs4Wss9ASn7+b/nJoVw2az1+Vhddd6WOG37uXaXmg/TOrtd8jK6p4ydAtEDAc0Bvh1B05+Ctk9BfKLvmMsmyHLCZpyicoaEuaZxtBaEt0u4naWmGImjkk+4BtC4vKgWhvfTZTjXChEugPXH+RDveCNBSOMXTJC3AH9QRzdHuHE450hK4F2e9BNVFkAGGDZCcjyWZaqStkWFvpK0hfFsQOjKFltZmZotXbjnh4zIEjtbIIjApt/Q0l3lu3xnOXx+x0nPWrV+Lw+N2+npuafHjykwdMeleRDcf/cr0h+bDX20l95t/HEvjtMBz0AcPSOXGVJ0A7FZ7Va1P3TUFOYIG8PEsxbI4h9M0R1EtCrYouK/xJkdBsEmzDL4bDBI4YJAFDBKUg0HHmFfCIN5xvKMH37ReiTBINwKDPLiqFAV+LAP1BZXFMBXnYkvgIYkASaIVQqr6emWNDA3CYHnh2zDozJw6IR2aPP24Mv4hNWqtvrBu3bBGpz+kxtBCYvo34JYb0kG0Z80v2fduAb2ci3cRz66/A7zVN1/b8PKaD5hlek7zAbO2kp8AmGDZOdCKOyCVG32tOd3WnG6LsQ2Z093GWJcUFUPNjrMdPb398rF1xgrnT+B9jWAseHAcOAgMQ+EcDH2WxKmKjCW8OOnFIbijAyQEd7iPE/CqjK2eYY+MrS5826TuOt7cFcl8GiA3bN1ZRWuUTx6sL18u2zfnCjcm65iU3a245iNkmXZvPkLWVnK/CSmwENRRPA597YBUbuzUScgzoqGp2NdRUY3seocPx7AMQ5CUQNEk5667tsLKFvL2E3moq7M8S+yOeAQQjwTiuUGlY7YrLmKePnmu50IJeD2d54Pt3b0NCSpxjiJ5XOBJ8HPRD7riKibBeHHOSwpdaBs6EyB5H18DeNUz7BF41YVvBV7+ybvcygPr/UB+cgiCvOLweOHdkp2+jmK7O0vFh49Q/AeBHdBqfq4wn63NvN8jsfmwV6b1mw97tZXcZ+yBPSZoAtTlEfbKjaA6sXdE1dT+uJY0dr+iSHEUwQN8eVCFFWiGY1rQa0FvX+M8nKKhGIrd3VwqA9Tj0JKi4GDPMd4V97VK7R2UxJdenOsUek52Rxqzdwf8RIYWGIIRCIYiWK4i9Ti0W4bgunD0pkUAJ30CV3Vba40Me6RedeFbqVdYeFhYeG2nU4X3U4U3o/bDWfgs/Hzdend382t7iFQTC3bqxw+pqxCmFZ5ese8tAMrQi3zXpuz5sfzL69a91/mr84WBVRTlPfnVWsnmskMQ36FAb2QIfhYWB6wrb6yBCbSmuHIvf3XJ+mHcGp3JL/+CwsAbr62FJWvwTX50wefz1cZrc6oOCdy3VIpX3hdS47nMjcLiCBQNJdp331ip+9bdW8W7c9aTn5EE9/sixMMzSB9Q4O1Ta+KV6xXksmP2wGBpk9KWrUoTC7nlWWvoPvobfJXL3vxHKm3ffleceWXdn/tH6iGSD2KnM3AX6Zwds669R2qMTK1V0ZNf7PRDe/Kv8B0cklzm1/zqVH56Krc0s1FLA6/QjOTdN/D4hdGr24pAFeuU4lTsDUgMd+FKqThrcbU4PGGPjtrXf3FzwSdcAWm51ZtImR1ZoDLthdvWU1RWbmkSlCxMzlnv3sLd3PIb9FyLL3Kr763Rl5AYNQoo4NRh086r77Qizec91dRxv50nAXThcJwEw4W2Ye2ww7/Hd/pX8HtiIlTYhsdDcwLFsgIpUyGRYBlW5nFJIKCtGVkkmdbMdhN6PBR42QQHHv6uHB5ubQ8V4W5WdrldIc5vP3L83Kk+YX0PVc/Rrzvbuxuzh4rjITzBKRaFCixFsnjlxWPwMXgIrrsIPkCzAULwkWz1PVTVM+zd46kifJvH8/5eYX4RqGc/vAl8yWVS1uTdjyszQHnMmn1lLb3ErBeD+Wtv3JlqazgLnoU1uwpAhlZy/QLAHQhA0Ls2Y00suSxFe40XpxCcfxxFHBuZyi3/hii6OIWyLN9xf0IC5DJM/R3+6nBymkzb5gNsmV7bfIStreQ+I5bBQWeS4wQYKQekciN/M2NLWsKnM7Cb019puQItV+CP4Arw4Aq4u6kdnlXwBI7gZ9s7enhufRtZz9HQV+2N2UbGshSFvG+KZ3CeETiO4St6AgBewovTaP8ywQZo3Efg1beRVc+wR0+guvBtS9xO4OwGvx9XHlirt3KrP9nPHxcfPiosXMstv7VnJiGuL7z428eVEWt80B77LZfN2iN3IBrNX4fAH0X0CJarP1npOXs1bV+bKCwMFYfHcysP7Js/2Hdm0WYwRwKK7l/PlCR/XJm2Jm7klsZy2acAb/e9qKdX7b+m65r6aCrN1+YlHO3BYyg8elZ4/6ysMtbQoPV+wJkrGLTdYH+9aLRQMnHXGlnMLadySyPudoGm3V1eZnw0n89RW8n99jnA66AEGsdhTB6QytmYVlzfgvkfCeY8wJwAmNNre8KJynvC28+e6uyhS+dzODDvbQjMGYaiwbenBBh2FEHzAl6D5WyX8650gKJ9ePXjOWpkaAjLKwnfxvLlbGF+3p0cR1Pt6SwQJZ8egz97ZsJ+6Ey4Z0asofvAsw+p0Vxmqnh/DM07Z55b06tAxw+pMQSkdAqiZ8AYZMwtPbRuXEFh9PLjQupK/vqInf4NsqCAePqnXCaLXjNOz6EXgp1b1g/jm5NZb+frg3lTqm6NPEOfN67kMsPW4DPrxgB4B81J450dvPlgXFPH/WcxCeE+RePoMJIyJqKF4haK/4goZh0UO0Sp+HoWfapDlUrHgfQcPX/+ZHdDjgNBu085GGgMdDkBhhtJMNVYLHgJpotgAgQfYCifUP08kBoZ9s7iKsK3svi0iSkGZohKCDOjogkfMob6Meb2Y3QzDrYBE9WQ+yVcFyd3L1aOmZguSyAy1u/DzoqKGuvHDC0uY1rYyR7U4ZoBUi5CNswwdU2NYGJQiSlmP2ZqWFzsRTfAvpnRcDKGskWSqtGGaRdl3SvHE1HRUC4rkAlJi8u6YhpO+WBbFPmivHYysluYEtJikDWYNDHxoqaEStkUw4RyDPSjH4oMyT7sHChpQh82sK6krGJnkyp2XIS0XUkQifUoogYPJsbgcSRRxUIaKBnTTLckkGv4sM17BrrQo7o91UnfB3rCcwXhsRwN4BlKVXLo/5Ka+Wc0hmTd/e7DTjtSe7EuRVSlqKg5SqJrBqbKZp+m92JGEsbxRcXQdLjp1HOfqJqoDsXQt0mjnnIwaFNRhXqH54Yyw1i/loRHUw8doIQ/myV5lzUtjilqG2bqThuZSR3VQJ/qiL2oxZIb7RvTkiEjIYvohSGsy6kZt++sCwtC9YsRVQkrcqgNHkKKYqKxSb8vNBNq6hx63NOqpISgPd0bbet9I6hEsETSiPqa0zcqY3GazzmqreR+e0cUKMIgVdA5MOWsdp3u0VdiFIhRZedmIqqZmqkrccNRT4opiQR0U29CNKNeAw0pSTb8Leeq5Vw1u3MloP0LjONdOT5Cpf0Lve3HO1We3Vi1OC+2N2bDJs3hLEswPIOzDE5zDEdVW7UgcPjrIqgAQwQIzkcQtVYtqmXYs3dVTfg276oEL3TEBtYXlXXZIdYx6OiyAQh0z3Av+Thafd7VrsVqvRiylnBNDmHBfhe44PzEND2EnDFwL8B+fNakXNzZV5qQizWV3HcuCgQow3HQP4GLZcZbnVxsDyXdysSOimokJpZD5Fp9yutJg05KR9sWD1s8bHYeEjgCIu4A0THrFYF45GyH2ndZPtdwILICBdd4lqMFBkYoyzOVX9zbjCAqgFM+kifqBuLODA0E4k7hW4GIoltFDUPlqxKaEQDyyBAkG/DRhqI9CFxRJBmG0FSXHRtbFxB3L1YthfTrGGxO9pXpFs3HvtpKfhL2cTwFXfGAVG5o1cm+s7oSilYiHqgQ0pWLaKZCimpazFFQ18SQ15QNswW+Fvj+1cBHVQZf97EOir9cmme/1Ck26I11GI4MeKkcDtdZnqdJ56CZsuAjCbR3HL0tRwYYLkCTPoKvOs9eI8PewFdD+I7TQNFxnNPT1tuHxavXnN3az63nmfxt9DKZff+qlbqP1oVnJuzZ0WIKHVFmT2esxReFR89QysEX9s05aziLFoUn0MtehdR4fmY2t5oupAYLI8NumsLwc2vqVX46Y4+iV+gKw79ab18Uh9LF+2jRGcpFi87XJuzUw8IvQ/ZCqi64NqfqaNd7NptbGigMv7J/fG2lxuzFKfvuBHoTcGQ4PzcP39Gh4u9+gVLy1/5mjcyCWCszbqenC/MpuAiPYKcHrIEJdzk/l0nZc4/zk0N26mcrvYgKSg2AKGvkiX3nLVJ+8ql1fRjJX3+uwuMle/wdXMlPv8xPzxfezhQfzSFtpx/nlmcL72+jqoCKSs807StvZUZfE/oXNZXcZ/+CJQWCxtHZbbwA/kUZC9bMO/IrbG+o4gZZ7ybtl9O7PtWAYzmSA4+Lx3mCQ/Pz7j+psJ9OkXO6XckpIukdThG586w7/Qux/Vsx9PWXYc3fQ5z572T3Menzzk1n3cVpf9j4X97oPtP3eaeUFOmjl6XEOSrRqUa6z57xqqfYaMexz+mjJ49cuHCsz2+AL+r/Ulb+jTzKbzoLT2SoMMeCq/X/7V3LTsJQEP0iCb3Xvtwa/QAi7lwo4NK1GxKfCWITiwoLRUlwIRvAFwFaCf+ifa78BWdaMIRHi5FINd216dzJpO3tOXM7c+422RRxLzO6xbNiknIJmhKTiWhItAJHtBiWYyjMGcp+h2kRptcn0GsZdOjCJKIVjy/HdgQ21V9y312Pzai2EG9SVEBFLxGSIUJp1JNoiQuEWUPRPqA2fIQh1I9oeQz4OdHycD5EtJ7zVqemZ0u9Ur1zyS5VrbMiwLvVaBpVdQrCM42L4EH5mOcbPCj3D/K3oZwSiIJwPLxT2Fw3Okf+F5SHRYAhav6F5QkHNPE/NWEcAVnn0z8RNFdWgXsJX3p6swPNRdxkgbCCIMB7TVgPYaFBlGLoEuUjHO8pp+czYHaYOcb5UJs9oF1VNouneuYB9wpRFCPbttWccVm3D+4wk6+/DHSZY+qry5LVrIMlJsbHFa1VMPMSbtZVrAyOxWzZcQ75sNZSBi0hiwYbcGWqJeNJddvfsRu+dosF77XD6YSFAhm6U/CPxtgOIEsfr5me/dURiuUoivmo6rmO1ZXdeLTOxdvezfvePpxqyj2uRrRPsPOvjAL2bjxwbHWvdakAwbjO3atWo2wrGEMwWcnoBAoeKfGNcS6chMP8GXV4Rz9BISUJKUlISeZPSZj+D5ONdPoTGgcKu+CIAAA=');

  var input = new Uint8Array(comments.length);
  for (var i = 0; i < comments.length; i++) { input[i] = comments.charCodeAt(i);}
  var output = pako.inflate(input,{ to: 'string' });
  window.g_commentLoader.onLoad(JSON.parse(output));
})();