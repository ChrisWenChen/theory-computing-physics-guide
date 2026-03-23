import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import Translate from '@docusaurus/Translate';
import styles from './styles.module.css';

type FeatureItem = {
  title: ReactNode;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: <Translate id="homepage.feature1.title">从零开始</Translate>,
    description: (
      <Translate id="homepage.feature1.description">
        从计算机基础、终端操作、包管理器讲起，不假设你有任何系统管理经验。每一步都有三平台（macOS / Ubuntu / Windows）的具体操作指南。
      </Translate>
    ),
  },
  {
    title: <Translate id="homepage.feature2.title">面向科研</Translate>,
    description: (
      <Translate id="homepage.feature2.description">
        内容围绕计算物理和理论物理的真实科研需求设计：Python 科学计算、C/C++/Fortran 编译、MPI/OpenMP 并行、高性能数值库、远程服务器、文献管理。
      </Translate>
    ),
  },
  {
    title: <Translate id="homepage.feature3.title">动手验证</Translate>,
    description: (
      <Translate id="homepage.feature3.description">
        每章都包含安装步骤和测试方法。不只是告诉你"装什么"，更告诉你"怎么确认装好了"。学完即可用于自己的科研项目。
      </Translate>
    ),
  },
];

function Feature({title, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md" style={{paddingTop: '2rem'}}>
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
