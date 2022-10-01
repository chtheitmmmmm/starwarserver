if __name__ == '__main__':
    import os
    total = 0
    for dirn, dirns, filens in os.walk('src'):
        for f in filens:
            if f.endswith('.ts'):
                delt = len(open(f'{dirn}/{f}', encoding="utf-8").readlines())
                print(f'文件{dirn}/{f}，有码{delt}行')
                total += delt
    print(total)