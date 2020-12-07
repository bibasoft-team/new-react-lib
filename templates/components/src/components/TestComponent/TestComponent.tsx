import React from 'react'
import classNamesBind from 'classnames/bind'
import styles from './TestComponent.module.scss'

import { TestComponentProps } from './TestComponent.d'

const cx = classNamesBind.bind(styles)

const TestComponent: React.FC<TestComponentProps.Props> = props => {
	const { className } = props

	return <div className={cx('wrapper', className)}>some test</div>
}

// const mapStateToProps = (state: IAppState): TestComponentProps.Store => ({ });

// const mapDispatchToProps: MapDispatchToProps<
// 	TestComponentProps.Dispatch,
// 	TestComponentProps.Own
// > = (dispatch: TDispatch) => ({ });

// export default connect(
// 	mapStateToProps,
// 	mapDispatchToProps
// )(TestComponent);

export default TestComponent
